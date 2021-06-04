module.exports = class MockModel {
  constructor(object) {
    this.build = jest.fn(),
    this.findOne = jest.fn();
    this.findAll = jest.fn();
    this.destroy = jest.fn();
    this.update = jest.fn();
    if(!object) return;
    this.dataValues = {};
    Object.entries(object).forEach(entry => {
      const [ key, value ] = entry;
      this.dataValues[key] = value;
      this[key] = value;
    });
  }
}