import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import logger from 'console-log-color';

type Template = prompts.Choice;

const TEMPLATES: Template[] = [
  { title: "React", value: "react"},
];

async function main() {
  const answers = await prompts([
    {
      name: "projectName",
      type: "text",
      message: "Project name",
      initial: "skull",
    },
    {
      name: "framework",
      type: "select",
      message: "Select a framework",
      choices: TEMPLATES.map((option) => (option)),
    },

  ]);

  const { projectName, framework,} = answers;

  const templateName = `${framework}`
  const templatePath = path.join(__dirname, "..", "templates", templateName);
  if (!fs.existsSync(templatePath)) {
    console.error(
      logger.red(`Template ${templateName} at ${templatePath} not found!`)
    );
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), projectName);

  console.log();
  console.log(`Scaffolding app at ${logger.gray(projectPath)}`);
  console.log();

  fs.copySync(templatePath, projectPath);
  fs.moveSync(
    path.join(projectPath, "_gitignore"),
    path.join(projectPath, ".gitignore")
  );

  fs.moveSync(
    path.join(projectPath, "env.example"),
    path.join(projectPath, ".env")
  );


  console.log(`✔ Done! You can start with:`);
  console.log(`1. cd ${projectName}`);
  console.log(`2. npm install`);
  console.log(`3. npm run dev`);
}

main();