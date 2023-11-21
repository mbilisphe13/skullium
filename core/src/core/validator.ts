import {check, matchedData, ValidationChain, validationResult} from "express-validator"
import {database} from "../database";



type Schema = Record<string, string>

function camelToWords(field: string) {
    return (
        field
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space between lowercase and uppercase letters
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add a space between consecutive uppercase and lowercase letters
            .toLowerCase() // Convert the entire string to lowercase
            .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter of the first word
    );
}

const createValidationMiddleware = (schema: Schema) => {
    const middleware: ValidationChain[] = []

    Object.keys(schema).map((field) => {
        const rules = schema[field].split('|')

        for (const rule of rules) {
            const [ruleName, params] = rule.split(':')
            switch (ruleName) {
                case 'required':
                    middleware.push(check(field, `${camelToWords(field)} is required.`).exists())
                    break

                case 'min':
                    const [min] = params.split(',')
                    middleware.push(check(field, `${camelToWords(field)} must be at least ${min}.`).isInt({min: parseInt(min)}))
                    break

                case 'in':
                    const inArray = params.split(',')
                    middleware.push(check(field, `${camelToWords(field)} must be one of ${inArray.join(', ')}.`).isIn(inArray))
                    break

                case 'notIn':
                    const notInArray = params.split(',')
                    middleware.push(check(field, `${camelToWords(field)} can not be one of ${notInArray.join(', ')}.`).not().isIn(notInArray))
                    break

                case 'max':
                    const [max] = params.split(',')
                    middleware.push(check(field, `${camelToWords(field)} must not be more than ${max}.`).isInt({max: parseInt(max)}))
                    break

                case 'length':
                    const [maxLength] = params.split(',')
                    middleware.push(check(field, `${camelToWords(field)} must be more than ${maxLength} characters long.`).isLength({min: parseInt(maxLength, 10)}))
                    break

                case 'digits':
                    const [count] = params.split(',')
                    middleware.push(check(field, `${camelToWords(field)} must be ${count} digits long.`).isLength({
                        min: parseInt(count, 10),
                        max: parseInt(count, 10)
                    }))
                    break

                case 'email':
                    middleware.push(check(field, `${camelToWords(field)} must be a valid email address.`).isEmail())
                    break

                case 'unique':
                    const [table, column, exclude] = params.split(',')
                    middleware.push(check(field).custom(async (value: any) => {
                        const record = await database.query(
                            `SELECT * FROM ${table} WHERE ${column || field} = '${value}' ${exclude ? `AND id != '${exclude}'` : ''} LIMIT 1`
                        )

                        if (record.length > 0) {
                            throw new Error(`${camelToWords(field)} already taken.`)
                        }
                    }))
                    break
                case 'confirmed':
                    middleware.push(
                        check(field).custom((value: any, {req}) => {
                                if (value != req.body[`${field}Confirmation`]) {
                                    throw new Error(`${camelToWords(field)}s do not match.`)
                                }
                                return true
                            }
                        )
                    )
                    break
            }

        }
    })
    return middleware
}

export function Validate(schema: Schema) {
    return function (target: any, name: string, method: any) {
        const _method = method.value

        method.value = async function (...args: any[]) {
            let [req, res, next] = args

            const validations = createValidationMiddleware(schema)
            for (let validation of validations) {
                const result = await validation.run(req)
            }

            const errors = validationResult(req).array()
            if (errors.length) {
                const transformedErrors: Record<string, string[]> = {}

                errors.forEach((error: any) => {
                    if (!transformedErrors[error.path]) {
                        transformedErrors[error.path] = [error.msg]
                    } else {
                        transformedErrors[error.path].push(error.msg)
                    }
                })
                if (res.inertia) {
                    res.errors(transformedErrors)
                    return res.back()
                }
                return res.status(422).json({errors: transformedErrors})
            }

            if(!req.skull) {
                req.skull = {}
            }

            req.skull.validated = matchedData(req)

            return _method.apply(this, [req, res, next])
        }

        return method
    }
}