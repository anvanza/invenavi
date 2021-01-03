'use strict';

const i2c = require('i2c-bus');

const LSM9DS1 = {
    MAG_ADDRESS: 0x1C,	//Would be 0x1E if SDO_M is HIGH
    ACC_ADDRESS: 0x6A,
    GYR_ADDRESS: 0x6A,  //Would be 0x6B if SDO_AG is HIGH

    /////////////////////////////////////////
    // LSM9DS1 Accel/Gyro (XL/G) Registers //
    /////////////////////////////////////////
    ACT_THS: 0x04,
    ACT_DUR: 0x05,
    INT_GEN_CFG_XL: 0x06,
    INT_GEN_THS_X_XL: 0x07,
    INT_GEN_THS_Y_XL: 0x08,
    INT_GEN_THS_Z_XL: 0x09,
    INT_GEN_DUR_XL: 0x0A,
    REFERENCE_G: 0x0B,
    INT1_CTRL: 0x0C,
    INT2_CTRL: 0x0D,
    WHO_AM_I_XG: 0x0F,
    CTRL_REG1_G: 0x10,
    CTRL_REG2_G: 0x11,
    CTRL_REG3_G: 0x12,
    ORIENT_CFG_G: 0x13,
    INT_GEN_SRC_G: 0x14,
    OUT_TEMP_L: 0x15,
    OUT_TEMP_H: 0x16,
    STATUS_REG_0: 0x17,
    OUT_X_L_G: 0x18,
    OUT_X_H_G: 0x19,
    OUT_Y_L_G: 0x1A,
    OUT_Y_H_G: 0x1B,
    OUT_Z_L_G: 0x1C,
    OUT_Z_H_G: 0x1D,
    CTRL_REG4: 0x1E,
    CTRL_REG5_XL: 0x1F,
    CTRL_REG6_XL: 0x20,
    CTRL_REG7_XL: 0x21,
    CTRL_REG8: 0x22,
    CTRL_REG9: 0x23,
    CTRL_REG10: 0x24,
    INT_GEN_SRC_XL: 0x26,
    STATUS_REG_1: 0x27,
    OUT_X_L_XL: 0x28,
    OUT_X_H_XL: 0x29,
    OUT_Y_L_XL: 0x2A,
    OUT_Y_H_XL: 0x2B,
    OUT_Z_L_XL: 0x2C,
    OUT_Z_H_XL: 0x2D,
    FIFO_CTRL: 0x2E,
    FIFO_SRC: 0x2F,
    INT_GEN_CFG_G: 0x30,
    INT_GEN_THS_XH_G: 0x31,
    INT_GEN_THS_XL_G: 0x32,
    INT_GEN_THS_YH_G: 0x33,
    INT_GEN_THS_YL_G: 0x34,
    INT_GEN_THS_ZH_G: 0x35,
    INT_GEN_THS_ZL_G: 0x36,
    INT_GEN_DUR_G: 0x37,

    ///////////////////////////////
    // LSM9DS1 Magneto Registers //
    ///////////////////////////////
    OFFSET_X_REG_L_M: 0x05,
    OFFSET_X_REG_H_M: 0x06,
    OFFSET_Y_REG_L_M: 0x07,
    OFFSET_Y_REG_H_M: 0x08,
    OFFSET_Z_REG_L_M: 0x09,
    OFFSET_Z_REG_H_M: 0x0A,
    WHO_AM_I_M: 0x0F,
    CTRL_REG1_M: 0x20,
    CTRL_REG2_M: 0x21,
    CTRL_REG3_M: 0x22,
    CTRL_REG4_M: 0x23,
    CTRL_REG5_M: 0x24,
    STATUS_REG_M: 0x27,
    OUT_X_L_M: 0x28,
    OUT_X_H_M: 0x29,
    OUT_Y_L_M: 0x2A,
    OUT_Y_H_M: 0x2B,
    OUT_Z_L_M: 0x2C,
    OUT_Z_H_M: 0x2D,
    INT_CFG_M: 0x30,
    INT_SRC_M: 0x30,
    INT_THS_L_M: 0x32,
    INT_THS_H_M: 0x33,

    ////////////////////////////////
    // LSM9DS1 WHO_AM_I Responses //
    ////////////////////////////////
    WHO_AM_I_AG_RSP: 0x68,
    WHO_AM_I_XG_RSP: 0x68,
    WHO_AM_I_M_RSP: 0x3D,
}

const LSM9DS0 = {
    MAG_ADDRESS: 0x1E,
    ACC_ADDRESS: 0x1E,
    GYR_ADDRESS: 0x6A,

    //LSM9DS0 Gyro Registers,
    WHO_AM_I_G: 0x0F,
    CTRL_REG1_G: 0x20,
    CTRL_REG2_G: 0x21,
    CTRL_REG3_G: 0x22,
    CTRL_REG4_G: 0x23,
    CTRL_REG5_G: 0x24,
    REFERENCE_G: 0x25,
    STATUS_REG_G: 0x27,
    OUT_X_L_G: 0x28,
    OUT_X_H_G: 0x29,
    OUT_Y_L_G: 0x2A,
    OUT_Y_H_G: 0x2B,
    OUT_Z_L_G: 0x2C,
    OUT_Z_H_G: 0x2D,
    FIFO_CTRL_REG_G: 0x2E,
    FIFO_SRC_REG_G: 0x2F,
    INT1_CFG_G: 0x30,
    INT1_SRC_G: 0x31,
    INT1_THS_XH_G: 0x32,
    INT1_THS_XL_G: 0x33,
    INT1_THS_YH_G: 0x34,
    INT1_THS_YL_G: 0x35,
    INT1_THS_ZH_G: 0x36,
    INT1_THS_ZL_G: 0x37,
    INT1_DURATION_G: 0x38,

    //LSM9DS0 Accel and Magneto Registers,
    OUT_TEMP_L_XM: 0x05,
    OUT_TEMP_H_XM: 0x06,
    STATUS_REG_M: 0x07,
    OUT_X_L_M: 0x08,
    OUT_X_H_M: 0x09,
    OUT_Y_L_M: 0x0A,
    OUT_Y_H_M: 0x0B,
    OUT_Z_L_M: 0x0C,
    OUT_Z_H_M: 0x0D,
    WHO_AM_I_XM: 0x0F,
    INT_CTRL_REG_M: 0x12,
    INT_SRC_REG_M: 0x13,
    INT_THS_L_M: 0x14,
    INT_THS_H_M: 0x15,
    OFFSET_X_L_M: 0x16,
    OFFSET_X_H_M: 0x17,
    OFFSET_Y_L_M: 0x18,
    OFFSET_Y_H_M: 0x19,
    OFFSET_Z_L_M: 0x1A,
    OFFSET_Z_H_M: 0x1B,
    REFERENCE_X: 0x1C,
    REFERENCE_Y: 0x1D,
    REFERENCE_Z: 0x1E,
    CTRL_REG0_XM: 0x1F,
    CTRL_REG1_XM: 0x20,
    CTRL_REG2_XM: 0x21,
    CTRL_REG3_XM: 0x22,
    CTRL_REG4_XM: 0x23,
    CTRL_REG5_XM: 0x24,
    CTRL_REG6_XM: 0x25,
    CTRL_REG7_XM: 0x26,
    STATUS_REG_A: 0x27,
    OUT_X_L_A: 0x28,
    OUT_X_H_A: 0x29,
    OUT_Y_L_A: 0x2A,
    OUT_Y_H_A: 0x2B,
    OUT_Z_L_A: 0x2C,
    OUT_Z_H_A: 0x2D,
    FIFO_CTRL_REG: 0x2E,
    FIFO_SRC_REG: 0x2F,
    INT_GEN_1_REG: 0x30,
    INT_GEN_1_SRC: 0x31,
    INT_GEN_1_THS: 0x32,
    INT_GEN_1_DURATION: 0x33,
    INT_GEN_2_REG: 0x34,
    INT_GEN_2_SRC: 0x35,
    INT_GEN_2_THS: 0x36,
    INT_GEN_2_DURATION: 0x37,
    CLICK_CFG: 0x38,
    CLICK_SRC: 0x39,
    CLICK_THS: 0x3A,
    TIME_LIMIT: 0x3B,
    TIME_LATENCY: 0x3C,
    TIME_WINDOW: 0x3D,

    ////////////////////////////////
    // LSM9DS0 WHO_AM_I Responses //
    ////////////////////////////////
    WHO_AM_I_G_RSP: 0xd4,
    WHO_AM_I_XM_RSP: 0x49,
}

const LSM6DSL = {

    ADDRESS: 0x6A,

    WHO_AM_I: 0x0F,
    RAM_ACCESS: 0x01,
    CTRL1_XL: 0x10,
    CTRL8_XL: 0x10,
    CTRL2_G: 0x11,
    CTRL10_C: 0x19,
    TAP_CFG1: 0x58,
    INT1_CTR: 0x0D,
    CTRL3_C: 0x12,
    CTRL4_C: 0x13,

    STEP_COUNTER_L: 0x4B,
    STEP_COUNTER_H: 0x4C,

    OUTX_L_XL: 0x28,
    OUTX_H_XL: 0x29,
    OUTY_L_XL: 0x2A,
    OUTY_H_XL: 0x2B,
    OUTZ_L_XL: 0x2C,
    OUTZ_H_XL: 0x2D,

    OUT_L_TEMP: 0x20,
    OUT_H_TEMP: 0x21,

    OUTX_L_G: 0x22,
    OUTX_H_G: 0x23,
    OUTY_L_G: 0x24,
    OUTY_H_G: 0x25,
    OUTZ_L_G: 0x26,
    OUTZ_H_G: 0x27,

    TAP_CFG: 0x58,
    WAKE_UP_DUR: 0x5C,
    FREE_FALL: 0x5D,
    MD1_CFG: 0x5E,
    MD2_CFG: 0x5F,
    WAKE_UP_SRC: 0x1B,
    TAP_THS_6D: 0x59,
    INT_DUR2: 0x5A,
    WAKE_UP_THS: 0x5B,
    FUNC_SRC1: 0x53,

    WHO_AM_I_RSP: 0x6A

}

const LIS3MDL = {

    ADDRESS   : 0x1C,
    
    WHO_AM_I  : 0x0F,
    
    CTRL_REG1 : 0x20,

    CTRL_REG2 : 0x21,
    CTRL_REG3 : 0x22,
    CTRL_REG4 : 0x23,
    CTRL_REG5 : 0x24,

    STATUS_REG: 0x27,

    OUT_X_L   : 0x28,
    OUT_X_H   : 0x29,
    OUT_Y_L   : 0x2A,
    OUT_Y_H   : 0x2B,
    OUT_Z_L   : 0x2C,
    OUT_Z_H   : 0x2D,

    TEMP_OUT_L: 0x2E,
    TEMP_OUT_H: 0x2F,

    INT_CFG   : 0x30,
    INT_SRC   : 0x31,
    INT_THS_L : 0x32,
    INT_THS_H : 0x33,

    WHO_AM_I_RSP: 0x3D
}

const BMP280 = {
    ADDRESS   : 0x77,
    TRIMMING: 0x88,
}

const open = options => {
    const berryImu = new BerryIMU(i2c, {});
    berryImu.init();

    return berryImu;
};

class BerryIMU {
    constructor(i2cBus, options) {
        this._i2cBus = i2cBus;
        this._options = options;

        this.BerryIMUversion = 0;
        this.G_GAIN = 0.070  // [deg/s/LSB]  If you change the dps for gyro, you need to update this value accordingly
        this.RAD_TO_DEG = 57.29578;
        this.gyroXangle = 0.0;
        this.gyroYangle = 0.0;
        this.gyroZangle = 0.0;

        //calibration values
        this.magXmin =  0;
        this.magYmin =  0;
        this.magZmin =  0;
        this.magXmax =  0;
        this.magYmax =  0;
        this.magZmax =  0;

        //Gforces
        this.maxGX = 0;
        this.maxGY = 0;
        this.maxGZ = 0;

        this.loopTimer = Date.now();
    }
    
    init() {
        this.detectIMU();

        const i2c1 = this._i2cBus.openSync(1);

        //For BerryIMUv1
        if(this.BerryIMUversion === 1) {
            //initialise the accelerometer
            i2c1.writeByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.CTRL_REG1_XM, 0b01100111)  //z,y,x axis enabled, continuous update,  100Hz data rate
            i2c1.writeByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.CTRL_REG2_XM, 0b00011000)  //+/- 8G full scale

            //initialise the magnetometer
            i2c1.writeByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.CTRL_REG5_XM, 0b11110000)  //Temp enable, M data rate = 50Hz
            i2c1.writeByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.CTRL_REG6_XM, 0b01100000)  //+/- 12gauss
            i2c1.writeByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.CTRL_REG7_XM, 0b00000000)  //Continuous-conversion mode

            //initialise the gyroscope
            i2c1.writeByteSync(LSM9DS0.GYR_ADDRESS, LSM9DS0.CTRL_REG1_G, 0b00001111)   //Normal power mode, all axes enabled
            i2c1.writeByteSync(LSM9DS0.GYR_ADDRESS, LSM9DS0.CTRL_REG4_G, 0b00110000)   //Continuous update, 2000 dps full scale

            //For BerryIMUv2
        }else if(this.BerryIMUversion === 2) {
            
            //initialise the accelerometer
            i2c1.writeByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.CTRL_REG5_XL, 0b00111000)   //z, y, x axis enabled for accelerometer
            i2c1.writeByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.CTRL_REG6_XL, 0b00111000)   //+/- 8g

            //initialise the gyroscope
            i2c1.writeByteSync(LSM9DS1.GYR_ADDRESS, LSM9DS1.CTRL_REG4, 0b00111000)      //z, y, x axis enabled for gyro
            i2c1.writeByteSync(LSM9DS1.GYR_ADDRESS, LSM9DS1.CTRL_REG1_G, 0b10111000)    //Gyro ODR = 476Hz, 2000 dps
            i2c1.writeByteSync(LSM9DS1.GYR_ADDRESS, LSM9DS1.ORIENT_CFG_G, 0b10111000)   //Swap orientation

            //initialise the magnetometer
            i2c1.writeByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.CTRL_REG1_M, 0b10011100)    //Temp compensation enabled,Low power mode mode,80Hz ODR
            i2c1.writeByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.CTRL_REG2_M, 0b01000000)    //+/- 2gauss
            i2c1.writeByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.CTRL_REG3_M, 0b00000000)    //continuous update
            i2c1.writeByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.CTRL_REG4_M, 0b00000000)    //lower power mode for Z axis

            //init the temperature sensor
            //Read data back from 0x88(136), 24 bytes

            let b1 = Buffer.alloc(24);
            i2c1.readI2cBlockSync(BMP280.ADDRESS, BMP280.TRIMMING, 24, b1);

            //Convert the data
            //Temp coefficents
            let dig_T1 = b1[1] * 256 + b1[0];
            let dig_T2 = b1[3] * 256 + b1[2];
            if (dig_T2 > 32767) {
                dig_T2 -= 65536;
            }
            let dig_T3 = b1[5] * 256 + b1[4];
            if (dig_T3 > 32767) {
                dig_T3 -= 65536;
            }

            this.bmpTrimming = {
                dig_T1: dig_T1,
                dig_T2: dig_T2,
                dig_T3: dig_T3,
            }

            // BMP280 address, 0x77(118)
            // Select Control measurement register, 0xF4(244)
            //		0x27(39)	Pressure and Temperature Oversampling rate = 1
            //					Normal mode
            i2c1.writeByteSync(BMP280.ADDRESS, 0xF4, 0x27)
            // BMP280 address, 0x77(118)
            // Select Configuration register, 0xF5(245)
            //		0xA0(00)	Stand_by time = 1000 ms
            i2c1.writeByteSync(BMP280.ADDRESS, 0xF5, 0xA0)

            //For BerryIMUv3
        }else if(this.BerryIMUversion === 3) {

            //initialise the accelerometer
            i2c1.writeByteSync(LSM6DSL.ADDRESS, LSM6DSL.CTRL1_XL, 0b10011111)           //ODR 3.33 kHz, +/- 8g , BW = 400hz
            i2c1.writeByteSync(LSM6DSL.ADDRESS, LSM6DSL.CTRL8_XL, 0b11001000)           //Low pass filter enabled, BW9, composite filter
            i2c1.writeByteSync(LSM6DSL.ADDRESS, LSM6DSL.CTRL3_C, 0b01000100)            //Enable Block Data update, increment during multi byte read

            //initialise the gyroscope
            i2c1.writeByteSync(LSM6DSL.ADDRESS, LSM6DSL.CTRL2_G, 0b10011100)            //ODR 3.3 kHz, 2000 dps

            //initialise the magnetometer
            i2c1.writeByteSync(LIS3MDL.ADDRESS, LIS3MDL.CTRL_REG1, 0b11011100)         // Temp sensor enabled, High performance, ODR 80 Hz, FAST ODR disabled and Self test disabled.
            i2c1.writeByteSync(LIS3MDL.ADDRESS, LIS3MDL.CTRL_REG2, 0b00100000)         // +/- 8 gauss
            i2c1.writeByteSync(LIS3MDL.ADDRESS, LIS3MDL.CTRL_REG3, 0b00000000)         // Continuous-conversion mode
        }

        i2c1.closeSync();

    }

    readTmp() {
        const i2c1 = this._i2cBus.openSync(1);

        // BMP280 address, 0x77(118)
        // Read data back from 0xF7(247), 8 bytes
        // Pressure MSB, Pressure LSB, Pressure xLSB, Temperature MSB, Temperature LSB
        // Temperature xLSB, Humidity MSB, Humidity LSB
        let data = Buffer.alloc(8)
        i2c1.readI2cBlockSync(BMP280.ADDRESS, 0xF7, 8, data)
        i2c1.closeSync();

        // Convert pressure and temperature data to 19-bits
        let adc_t = ((data[3] * 65536) + (data[4] * 256) + (data[5] & 0xF0)) / 16

        // Temperature offset calculations
        let var1 = ((adc_t) / 16384.0 - (this.bmpTrimming.dig_T1) / 1024.0) * (this.bmpTrimming.dig_T2)
        let var2 = (((adc_t) / 131072.0 - (this.bmpTrimming.dig_T1) / 8192.0) * ((adc_t)/131072.0 - (this.bmpTrimming.dig_T1)/8192.0)) * (this.bmpTrimming.dig_T3)
        return (var1 + var2) / 5120.0;
    }

    fullInformation() {
        let ACC = this.readACC();
        let GYR = this.readGyro();
        let MAG = this.readGyro();
        let TMP = this.readTmp();

        //Apply compass calibration
        MAG.x -= (this.magXmin + this.magXmax) /2
        MAG.y -= (this.magYmin + this.magYmax) /2
        MAG.z -= (this.magZmin + this.magZmax) /2

        //Calculate loop Period(LP). How long between Gyro Reads
        let b = Date.now() - this.loopTimer;
        this.loopTimer = Date.now()
        let looptime = b/1000

        //Convert Gyro raw to degrees per second
        let rate_gyr_x =  GYR.x * this.G_GAIN
        let rate_gyr_y =  GYR.y * this.G_GAIN
        let rate_gyr_z =  GYR.z * this.G_GAIN

        //Calculate the angles from the gyro.
        this.gyroXangle += rate_gyr_x * looptime
        this.gyroYangle += rate_gyr_y * looptime
        this.gyroZangle += rate_gyr_z * looptime

        //Convert Accelerometer values to degrees
        let AccXangle =  (Math.atan2(ACC.y,ACC.z)*this.RAD_TO_DEG)
        let AccYangle =  (Math.atan2(ACC.z,ACC.x)+Math.PI)*this.RAD_TO_DEG

        //convert the values to -180 and +180
        if (AccYangle > 90) {
            AccYangle -= 270.0
        } else {
            AccYangle += 90.0
        }

        //Calculate heading
        let heading = 180 * Math.atan2(MAG.y,MAG.x)/Math.PI;

        //Only have our heading between 0 and 360
        if (heading < 0){
            heading += 360
        }

        //Normalize accelerometer raw values.
        let accXnorm = ACC.x/Math.sqrt(ACC.x * ACC.x + ACC.y * ACC.y + ACC.z * ACC.z)
        let accYnorm = ACC.y/Math.sqrt(ACC.x * ACC.x + ACC.y * ACC.y + ACC.z * ACC.z)


        //Calculate pitch and roll
        let pitch = Math.asin(accXnorm)
        let roll = -Math.asin(accYnorm/Math.cos(pitch))

        //Calculate the new tilt compensated values
        //The compass and accelerometer are orientated differently on the the BerryIMUv1, v2 and v3.
        //This needs to be taken into consideration when performing the calculations
        let magXcomp, magYcomp;

        if(this.BerryIMUversion === 1 || this.BerryIMUversion === 3) {
            //LSM9DS0 and (LSM6DSL & LIS2MDL)
            magXcomp = MAG.x * Math.cos(pitch) + MAG.z * Math.sin(pitch);
            magYcomp = MAG.x*Math.sin(roll)*Math.sin(pitch)+MAG.y*Math.cos(roll)-MAG.z*Math.sin(roll)*Math.cos(pitch);
        }else{
            //LSM9DS1
            magXcomp = MAG.x*Math.cos(pitch)-MAG.z*Math.sin(pitch)
            magYcomp = MAG.x*Math.sin(roll)*Math.sin(pitch)+MAG.y*Math.cos(roll)+MAG.z*Math.sin(roll)*Math.cos(pitch);
        }

        //Calculate tilt compensated heading
        let tiltCompensatedHeading = 180 * Math.atan2(magYcomp,magXcomp)/Math.PI;

        if (tiltCompensatedHeading < 0){
            tiltCompensatedHeading += 360
        }

        //calculate G force
        let yG = (ACC.x * 0.244)/1000
        let xG = (ACC.y * 0.244)/1000
        let zG = (ACC.z * 0.244)/1000

        return {
            acc: {
                XAngle: AccXangle,
                YAngle: AccYangle,
            },
            gyro: {
                XAngle: this.gyroXangle,
                YAngle: this.gyroYangle,
                ZAngle: this.gyroZangle,
            },
            gForce: {
                XAngle: xG,
                YAngle: yG,
                ZAngle: zG,
            },
            heading: heading,
            tiltCompensatedHeading: tiltCompensatedHeading,
            pitch: pitch,
            roll: roll,
            temperature: TMP,
        }
    }

    detectIMU() {
        // Detect which version of BerryIMU is connected using the 'who am i' register
        // BerryIMUv1 uses the LSM9DS0
        // BerryIMUv2 uses the LSM9DS1
        // BerryIMUv3 uses the LSM6DSL and LIS3MDL

        //open a sync I2C bus
        const i2c1 = this._i2cBus.openSync(1);

        try {
            //Check for BerryIMUv1 (LSM9DS0)
            let LSM9DS0_WHO_G_response = i2c1.readByteSync(LSM9DS0.GYR_ADDRESS, LSM9DS0.WHO_AM_I_G);
            let LSM9DS0_WHO_XM_response = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.WHO_AM_I_XM);

            if (LSM9DS0_WHO_G_response === LSM9DS0.WHO_AM_I_G_RSP && LSM9DS0_WHO_XM_response === LSM9DS0.WHO_AM_I_XM_RSP) {
                return this.BerryIMUversion = 1;
            }
        } catch (e) {
        }

        try {
            //Check for BerryIMUv2 (LSM9DS1)
            let LSM9DS1_WHO_XG_response = i2c1.readByteSync(LSM9DS1.GYR_ADDRESS, LSM9DS1.WHO_AM_I_XG);
            let LSM9DS1_WHO_M_response = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.WHO_AM_I_M);

            if (LSM9DS1_WHO_XG_response === LSM9DS1.WHO_AM_I_XG_RSP && LSM9DS1_WHO_M_response === LSM9DS1.WHO_AM_I_M_RSP) {
                this.BerryIMUversion = 2;
            }
        } catch (e) {
        }

        try {

            //Check for BerryIMUv3 (LSM6DSL and LIS3MDL)
            let LSM6DSL_WHO_AM_I_response = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.WHO_AM_I);
            let WHO_AM_I_response = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.WHO_AM_I);

            if (LSM6DSL_WHO_AM_I_response === LSM6DSL.WHO_AM_I_RSP && WHO_AM_I_response === LIS3MDL.WHO_AM_I_M_RSP) {
                this.BerryIMUversion = 3;
            }
        } catch (e) {
        }

        //Close the I2C bus for now
        i2c1.closeSync();

        return this.BerryIMUversion;
    }

    calibrateCompass(timeOut = 10000) {
        let MAG;

        //Preload the variables used to keep track of the minimum and maximum values
        let magXmin = 32767;
        let magYmin = 32767;
        let magZmin = 32767;
        let magXmax = -32767;
        let magYmax = -32767;
        let magZmax = -32767;

        let startTime = Date.now();
        let i = 0;

        while ((Date.now() - startTime) < timeOut) {
            MAG = this.readMag()

            if (MAG.x > magXmax) {
                magXmax = MAG.x
            }
            if (MAG.y > magYmax) {
                magYmax = MAG.y
            }
            if (MAG.z > magZmax) {
                magZmax = MAG.z
            }

            if (MAG.x < magXmin) {
                magXmin = MAG.x
            }
            if (MAG.y < magYmin) {
                magYmin = MAG.y
            }
            if (MAG.z < magZmin) {
                magZmin = MAG.z
            }

            i++;
        }

        //calibration failed
        if (magXmin === 32767 || magXmax === -32767) {
            console.error("calibration failed");
            return;
        }

        this.magXmin = magXmin;
        this.magYmin = magYmin;
        this.magZmin = magZmin;

        this.magXmax = magXmax;
        this.magYmax = magYmax;
        this.magZmax = magZmax;

        return{
            x: {
                min: magXmin,
                max: magXmax
            },
            y: {
                min: magYmin,
                max: magYmax
            },
            z: {
                min: magZmin,
                max: magZmax
            },
            calibrationPoints: i,
            readsPerSecond: i / (timeOut/1000),
        };
    }

    readMag() {
        let mag_x_l = 0;
        let mag_x_h = 0;
        let mag_y_l = 0;
        let mag_y_h = 0;
        let mag_z_l = 0;
        let mag_z_h = 0;

        //open a sync I2C bus
        const i2c1 = this._i2cBus.openSync(1);

        if(this.BerryIMUversion === 1) {
            mag_x_l = i2c1.readByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.OUT_X_L_M)
            mag_x_h = i2c1.readByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.OUT_X_H_M)

            mag_y_l = i2c1.readByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.OUT_Y_L_M)
            mag_y_h = i2c1.readByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.OUT_Y_H_M)

            mag_z_l = i2c1.readByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.OUT_Z_L_M)
            mag_z_h = i2c1.readByteSync(LSM9DS0.MAG_ADDRESS, LSM9DS0.OUT_Z_H_M)
        }else if(this.BerryIMUversion === 2) {
            mag_x_l = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.OUT_X_L_M)
            mag_x_h = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.OUT_X_H_M)

            mag_y_l = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.OUT_Y_L_M)
            mag_y_h = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.OUT_Y_H_M)

            mag_z_l = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.OUT_Z_L_M)
            mag_z_h = i2c1.readByteSync(LSM9DS1.MAG_ADDRESS, LSM9DS1.OUT_Z_H_M)
        }else if(this.BerryIMUversion === 3) {
            mag_x_l = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.OUT_X_L)
            mag_x_h = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.OUT_X_H)

            mag_y_l = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.OUT_Y_L)
            mag_y_h = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.OUT_Y_H)

            mag_z_l = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.OUT_Z_L)
            mag_z_h = i2c1.readByteSync(LIS3MDL.ADDRESS, LIS3MDL.OUT_Z_H)
        }

        i2c1.closeSync();

        let mag_x_combined = (mag_x_l | mag_x_h <<8)
        if (mag_x_combined > 32768) {
            mag_x_combined = mag_x_combined - 65536
        }

        let mag_y_combined = (mag_y_l | mag_y_h <<8)
        if (mag_y_combined > 32768) {
            mag_y_combined = mag_y_combined - 65536
        }

        let mag_z_combined = (mag_z_l | mag_z_h <<8)
        if (mag_z_combined > 32768) {
            mag_z_combined = mag_z_combined - 65536
        }

        return {
            x: mag_x_combined,
            y: mag_y_combined,
            z: mag_z_combined,
        }
    }
    
    readACC () {
        let acc_x_l = 0;
        let acc_x_h = 0;
        let acc_y_l = 0;
        let acc_y_h = 0;
        let acc_z_l = 0;
        let acc_z_h = 0;

        //open a sync I2C bus
        const i2c1 = this._i2cBus.openSync(1);

        if(this.BerryIMUversion === 1) {
            acc_x_l = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_X_L_A)
            acc_x_h = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_X_H_A)

            acc_y_l = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Y_L_A)
            acc_y_h = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Y_H_A)

            acc_z_l = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Z_L_A)
            acc_z_h = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Z_H_A)
        }else if(this.BerryIMUversion === 2) {
            acc_x_l = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_X_L_XL)
            acc_x_h = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_X_H_XL)

            acc_y_l = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Y_L_XL)
            acc_y_h = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Y_H_XL)

            acc_z_l = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Z_L_XL)
            acc_z_h = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Z_H_XL)
        }else if(this.BerryIMUversion === 3) {
            acc_x_l = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTX_L_XL)
            acc_x_h = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTX_H_XL)

            acc_y_l = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTY_L_XL)
            acc_y_h = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTY_H_XL)

            acc_z_l = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTZ_L_XL)
            acc_z_h = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTZ_H_XL)
        }

        i2c1.closeSync();

        let acc_x_combined = (acc_x_l | acc_x_h <<8)
        if (acc_x_combined > 32768) {
            acc_x_combined = acc_x_combined - 65536
        }

        let acc_y_combined = (acc_y_l | acc_y_h <<8)
        if (acc_y_combined > 32768) {
            acc_y_combined = acc_y_combined - 65536
        }

        let acc_z_combined = (acc_z_l | acc_z_h <<8)
        if (acc_z_combined > 32768) {
            acc_z_combined = acc_z_combined - 65536
        }
        
        return {
            x: acc_x_combined,
            y: acc_y_combined,
            z: acc_z_combined,
        }
    }

    readGyro () {
        let gyr_x_l = 0;
        let gyr_x_h = 0;
        let gyr_y_l = 0;
        let gyr_y_h = 0;
        let gyr_z_l = 0;
        let gyr_z_h = 0;

        //open a sync I2C bus
        const i2c1 = this._i2cBus.openSync(1);

        if(this.BerryIMUversion === 1) {
            gyr_x_l = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_X_L_G)
            gyr_x_h = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_X_H_G)

            gyr_y_l = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Y_L_G)
            gyr_y_h = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Y_H_G)

            gyr_z_l = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Z_L_G)
            gyr_z_h = i2c1.readByteSync(LSM9DS0.ACC_ADDRESS, LSM9DS0.OUT_Z_H_G)
        }else if(this.BerryIMUversion === 2) {
            gyr_x_l = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_X_L_G)
            gyr_x_h = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_X_H_G)

            gyr_y_l = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Y_L_G)
            gyr_y_h = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Y_H_G)

            gyr_z_l = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Z_L_G)
            gyr_z_h = i2c1.readByteSync(LSM9DS1.ACC_ADDRESS, LSM9DS1.OUT_Z_H_G)
        }else if(this.BerryIMUversion === 3) {
            gyr_x_l = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTX_L_G)
            gyr_x_h = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTX_H_G)

            gyr_y_l = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTY_L_G)
            gyr_y_h = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTY_H_G)

            gyr_z_l = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTZ_L_G)
            gyr_z_h = i2c1.readByteSync(LSM6DSL.ADDRESS, LSM6DSL.OUTZ_H_G)
        }

        i2c1.closeSync();

        let gyr_x_combined = (gyr_x_l | gyr_x_h <<8)
        if (gyr_x_combined > 32768) {
            gyr_x_combined = gyr_x_combined - 65536
        }

        let gyr_y_combined = (gyr_y_l | gyr_y_h <<8)
        if (gyr_y_combined > 32768) {
            gyr_y_combined = gyr_y_combined - 65536
        }

        let gyr_z_combined = (gyr_z_l | gyr_z_h <<8)
        if (gyr_z_combined > 32768) {
            gyr_z_combined = gyr_z_combined - 65536
        }

        return {
            x: gyr_x_combined,
            y: gyr_y_combined,
            z: gyr_z_combined,
        }
    }

    getHeading() {
        let MAG = this.readMag();

        //Calculate heading
        let heading = 180 * Math.atan2(MAG.y,MAG.x)/Math.PI;

        //Only have our heading between 0 and 360
        if (heading < 0) {
            heading += 360;
        }

        //rounding
        heading = Math.round((heading + Number.EPSILON) * 100) / 100;

        return heading;
    }

    getGForce() {
        let ACC = this.readACC();

        let yG = (ACC.x * 0.244)/1000
        let xG = (ACC.y * 0.244)/1000
        let zG = (ACC.z * 0.244)/1000

        return {
            x: xG,
            y: yG,
            z: zG
        }
    }

    showVersion() {
        return this.BerryIMUversion;
    }
}

module.exports = {
    open: open,
}