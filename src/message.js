const typeInfo = {
    text: {
        setter: '_setTextField',
        router: '_routeTextField'
    },
    event: {
        setter: '_setEventField',
        router: '_routeEventField'
    }
};

exports.Message = class {
    constructor(xml) {
        this.type = xml.MsgType[0];
        this.host = xml.ToUserName[0];
        this.user = xml.FromUserName[0];
        this.date = new Date(Number(xml.CreateTime[0] * 1000));
        this._xml = xml;

        this.setField();
    }
    setField() {
        this[typeInfo[this.type].setter]();
    }
    route(handlers) {
        this[typeInfo[this.type].router](handlers[this.type].bind(handlers));
    }

    _setTextField() {
        this.content = this._xml.Content[0];
        this.id = xml.MsgId[0];
    }
    _routeTextField(handler) {
        handler(this, this.content)
    }
    _setEventField() {
        this.event = this._xml.Event[0];
        if (this._xml.EventKey)
            this.eventkey = this._xml.EventKey[0];
        if (this._xml.Ticket)
            this.ticket = this._xml.ticket[0];
        if (this.event === 'LOCATION') {
            this.latitude = parseFloat(this._xml.Latitude[0]);
            this.longitude = parseFloat(this._xml.Longitude[0]);
            this.precision = parseFloat(this._xml.Precision[0]);
        }
    }
    _routeEventField(handler) {
        handler(this, this.event, this.eventKey);
    }
}
