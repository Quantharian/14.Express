/* eslint-disable @typescript-eslint/no-unused-vars */
class Invoice {
    company: Company;
    constructor(company: Company) {
        this.company = company;
    }
}

class Company {
    constructor (
        public name: string = 'Acme Inc.',
        public address: string='Address',
        public phone: string= 'Phone',
        public email: string= 'Email',
        public website: string= 'Website',
        public logo: string= 'Logo'
    ){
        console.log('Company created')
    }
}

const acme = new Company('Acme')
const invoice = new Invoice(acme)
const invoice2 = new Invoice(new Company('X'));
