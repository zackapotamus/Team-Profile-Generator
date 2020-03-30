// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.
Employee = require("./Employee");

class Manager extends Employee {
    constructor(name, id, email, office) {
        super(name, id, email);
        this.officeNumber = office;
        this.role = "Manager";
    }

    getOfficeNumber() {
        return this.officeNumber;
    }

    getOffice() {
        return this.officeNumber;
    }
}

module.exports = Manager;