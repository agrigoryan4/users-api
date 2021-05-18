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
        if(!areFieldsValid) throw new Error('No valid data provided');
        fields.forEach(field => {
            const [ prop, val ] = field;
            this.schema[prop] = val;
        });
        return this;
    }
    save() {
        const schemaCopy = Object.assign({}, this.schema);
        this.collection.push(schemaCopy);
    }
    find(queryObject) {
        console.log(queryObject)
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
        if(!id || !updateObject) throw new Error('No valid arguments provided');
        const foundElement = this.collection.find(elem => elem.id === id);
        if(!foundElement) throw new Error('No valid id provided');
        try {
            const updatedFields = Object.entries(updateObject);
            if(updatedFields.length === 0) return foundElement;
            updatedFields.forEach(field => {
                const [ prop, val ] = field;
                foundElement[prop] = val;
            });
        } catch (error) {
            throw new Error(error);
        }
        return foundElement;
    }
    findByIdAndDelete(id) {
        if(!id) throw new Error('No arguments provided');
        let elementFound = false;
        this.collection = this.collection.filter(elem => {
            if(elem.id === id) {
                elementFound = true;
                return false;
            };
            return true;
        });
        if(!elementFound) throw new Error('No valid id provided');
    }
}

module.exports = Model;