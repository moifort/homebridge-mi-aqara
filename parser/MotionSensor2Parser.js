const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');

class MotionSensor2Parser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'MotionSensor2_MotionSensor': MotionSensor2MotionSensorParser,
            'MotionSensor2_LightSensor': MotionSensor2LightSensorParser
        }
    }
}
MotionSensor2Parser.modelName = ['sensor_motion.aq2'];
module.exports = MotionSensor2Parser;

class MotionSensor2MotionSensorParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Motion Sensor 2',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.MotionSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.MotionDetected);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.MotionSensor);
            var motionDetectedCharacteristic = service.getCharacteristic(that.Characteristic.MotionDetected);
            var value = that.getMotionDetectedCharacteristicValue(jsonObj, null);
            if(null != value) {
                motionDetectedCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (motionDetectedCharacteristic.listeners('get').length == 0) {
                    motionDetectedCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getMotionDetectedCharacteristicValue(result, null);
                            if(null != value) {
                                callback(null, value);
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getMotionDetectedCharacteristicValue(jsonObj, defaultValue) {
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'status');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'motion_status');
        } else {
        }
        
        return (null != value) ? (value === 'motion') : false;
    }
}

class MotionSensor2LightSensorParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.SENSOR;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Motion Sensor 2',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.LightSensor(accessoryName);
        service.getCharacteristic(that.Characteristic.CurrentAmbientLightLevel);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.LightSensor);
            var currentAmbientLightLevelCharacteristic = service.getCharacteristic(that.Characteristic.CurrentAmbientLightLevel);
            var value = that.getCurrentAmbientLightLevelCharacteristicValue(jsonObj, null);
            if(null != value) {
                currentAmbientLightLevelCharacteristic.updateValue(value);
            }
            
            if(that.platform.ConfigUtil.getAccessorySyncValue(deviceSid, that.accessoryType)) {
                if (currentAmbientLightLevelCharacteristic.listeners('get').length == 0) {
                    currentAmbientLightLevelCharacteristic.on("get", function(callback) {
                        var command = '{"cmd":"read", "sid":"' + deviceSid + '"}';
                        that.platform.sendReadCommand(deviceSid, command).then(result => {
                            var value = that.getCurrentAmbientLightLevelCharacteristicValue(result, null);
                            if(null != value) {
                                callback(null, value);
                            } else {
                                callback(new Error('get value fail: ' + result));
                            }
                        }).catch(function(err) {
                            that.platform.log.error(err);
                            callback(err);
                        });
                    });
                }
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getCurrentAmbientLightLevelCharacteristicValue(jsonObj, defaultValue) {
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'lux');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'lux');
        } else {
        }
        
        if(null != value) {
            var lux = value / 1.0;
            if(!isNaN(lux)) {
                return lux > 0 ? lux : 0.0001;
            } else {
                return 0.0001;
            }
        } else {
            return defaultValue;
        }
    }
}