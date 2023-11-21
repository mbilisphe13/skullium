import { NextFunction, Request, Response } from "express";
import { render } from "./render";
import { redirect } from "./redirect";
import { checkVersion } from "./version";

class InertiaMiddleware {
  private version: string;
  private template: string;
  private auth:  ((req:Request) =>Promise< Record<string, any>>)|undefined

  private errors: Record<string, string[]> = {};
  private flash: { success: string[], message: string[], error: string[] } = { success: [], message: [], error: [] };

  private addFlash(key: 'success' | 'message' | 'error', value: string): void {
    this.flash[key].push(value);
  }


  constructor(
    template: string,
    version: string,
    auth: ((req:Request) =>Promise< Record<string, any>>)|undefined = undefined,
  ) {
    this.version = version;
    this.template = template;
    this.auth = auth;
  }


  private bindCommonProperties(req: Request, res: Response): void {
   
    if (!checkVersion(req, res, this.version)) {
      return;
    }

    res.success = (message: string) => this.addFlash('success', message);
    res.message = (message: string) => this.addFlash('message', message);
    res.error = (message: string) => this.addFlash('error', message);
    res.errors = (errors: Record<string, string[]>) => this.errors = errors;

    res.inertia = render(
      req,
      res,
      this.template,
      this.version,
      this.flash,
      this.errors,
      this.auth,
    );

    const { back, divert } = redirect(req, res);
    res.divert = divert;
    res.back = back;
  }

  public handle(req: Request, res: Response, next: NextFunction): void {
    this.bindCommonProperties(req, res);
    next();
  }
}

export function inertia(
  auth?: (req:Request) =>Promise< Record<string, any>>,
  template: string = process.env.INERTIA_VIEW || 'app',
  version: string = process.env.INERTIA_VERSION || '1.0') {

  const inertiaMiddleware = new InertiaMiddleware(template, version, auth);

  return inertiaMiddleware.handle.bind(inertiaMiddleware);
}