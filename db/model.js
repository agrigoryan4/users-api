const { 
    ModelNoValidArgumentsException, 
    ModelNotFoundException, 
    ModelValidationErrorException 
} = require('../exceptions/modelExceptions');

class Model {
    constructor(dbCollection, schema) {
        this.collection = dbCollection;
        this.schema = schema;
    }
    build(data) {
        const fields = Object.entries(data);
        const areFieldsValid = fields.every(field => {
            try {
                this.schema[field[0]];
            } catch (error) {
                return false;
            }
            return true;
        });
        if(!areFieldsValid) throw new ModelValidationErrorException();
        fields.forEach(field => {
            const [ prop, val ] = field;
            this.schema[prop] = val;
        });
        return this;
    }
    save() {
        const schemaCopy = Object.assign({}, this.schema);
        this.collection.push(schemaCopy);
        return schemaCopy;
    }
    findOne(queryObject) {
        if(!queryObject || Object.entries(queryObject).length === 0) {
            throw new ModelNoValidArgumentsException();
        }
        if(this.collection.length === 0) return null;
        const queries = Object.entries(queryObject);
        const foundElement = this.collection.find(document => {
            const isMatch = queries.every(query => {
                const [ prop, val ] = query;
                try {
                    if(document[prop] === val) return true;
                } catch (error) {
                    return false;
                }
            });
            return isMatch;
        });
        return foundElement ? foundElement : null;
    }
    find(queryObject) {
        if(!queryObject || Object.entries(queryObject).length === 0) return this.collection;
        if(this.collection.length === 0) return [];
        const queries = Object.entries(queryObject);
        const foundElements = this.collection.filter(document => {
            const isMatch = queries.every(query => {
                const [ prop, val ] = query;
                try {
                    if(document[prop] === val) return true;
                } catch (error) {
                    return false;
                }
            });
            return isMatch;
        });
        return foundElements;
    }
    findByIdAndUpdate(id, updateObject) {
        if(!id || !updateObject) throw new ModelNoValidArgumentsException();
        // check if the user exists
        const foundElement = this.collection.find(elem => elem.id === id);
        if(!foundElement) throw new ModelNotFoundException();
        // see which fields to update
        const fieldsToUpdate = Object.entries(updateObject);
        if(fieldsToUpdate.length === 0) return foundElement;
        // update the corresponding fields
        fieldsToUpdate.forEach(field => {
            const [ prop, val ] = field;
            foundElement[prop] = val;
        });
        return foundElement;
    }
    findByIdAndDelete(id) {
        if(!id) throw new ModelNoValidArgumentsException();
        let elementFound = false;
        this.collection = this.collection.filter(elem => {
            if(elem.id === id) {
                elementFound = true;
                return false;
            };
            return true;
        });
        if(!elementFound) throw new ModelNotFoundException();
    }
}

module.exports = Model;