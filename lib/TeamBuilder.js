const fs = require("fs");
const path = require("path");
const OUTPUT_DIR = path.resolve(__dirname, "../output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
const render = require("./htmlRenderer");
const inquirer = require("inquirer");
const chalk = require("chalk");

class TeamBuilder {
    constructor() {
        this.teamMembers = [];
        this.hasManager = false;
    }

    static isValidEmail(email) {
        return /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
    }

    start() {
        this.getEmployee();
    }

    getEmployee() {
        return inquirer.prompt([{
                name: "role",
                type: "list",
                message: "What role would you like to add to the team?",
                choices: () => {
                    if (!this.hasManager) {
                        this.hasManager = !this.hasManager;
                        return ["Manager"]

                    } else {
                        return ["Engineer", "Intern"];
                    }
                },
            },
            {
                name: "name",
                type: "input",
                message: "What is their name?"
            },
            {
                name: "id",
                type: "input",
                message: "What is their ID?"
            },
            {
                name: "email",
                type: "input",
                message: "What is their email address?",
                transformer: (input, answer) => TeamBuilder.isValidEmail(input) ? chalk.green(input) : chalk.red(input),
                validate: val => TeamBuilder.isValidEmail(val) || "Invalid email address"
            },
            {
                name: "officeNumber",
                type: "input",
                message: "What is their office number?",
                when: (val) => val.role === "Manager"
            },
            {
                name: "github",
                type: "input",
                message: "What is their github username?",
                when: (val) => val.role === "Engineer"
            },
            {
                name: "school",
                type: "input",
                message: "What is their school?",
                when: (val) => val.role === "Intern"
            }
        ]).then(val => {
            switch (val.role) {
                case "Manager":
                    this.teamMembers.push(new Manager(val.name, val.id, val.email, val.officeNumber));
                    break;
                case "Engineer":
                    this.teamMembers.push(new Engineer(val.name, val.id, val.email, val.github));
                    break;
                case "Intern":
                    this.teamMembers.push(new Intern(val.name, val.id, val.email, val.school));
                    break;
                default:
                    throw new Error("Invalid role.");
                    break;
            }
            this.askForNewTeamMember();
        }).catch((err) => {console.log(err)});
    }

    askForNewTeamMember() {
        inquirer.prompt([{
            name: "choice",
            type: "confirm",
            message: "Add another member to the team?"
        }]).then((val) => {
            if (val.choice) {
                this.getEmployee();
            } else {
                this.endTeamEntry();
            }
        })
    }

    endTeamEntry() {
        TeamBuilder.writeTeamHtml(render(this.teamMembers));
    }

    static writeTeamHtml(html) {
        fs.writeFile(outputPath, html, (err) => {
            if (err) throw err;
            console.log(`${outputPath} written.`)
        })
    }
}

module.exports = TeamBuilder;