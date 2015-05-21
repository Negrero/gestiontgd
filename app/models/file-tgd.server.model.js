'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * FileTgd Schema
 */
var FileTgdSchema = new Schema({
	nameFile: {
		type: String,
		required:'name file is required'
	},
	lista_bloque:{
		EF_PLACES: {
			size: Number,
			placePointerNewestRecord:Number,
			placeRecords:[{
				entryTime: Date,
				entryTypeDailyWorkPeriod: String,
				dailyWorkPeriodCountry: String,
				dailyWorkPeriodRegion: String,
				vehicleOdometerValue: Number
			}],
		noOfCardPlaceRecords: Number,
		fid: String
		},
		EF_ICC: {
			size: Number,
			clockStop: String,
			cardExtendedSerialNumber: {
				serialNumber: String,
				monthYear: String,
				type: String,
				manufacturerCode: {
					manufactureCode: String
				}
			},
			cardApprovalNumber: {
				number: String
			},
			cardPersonaliserID: Number,
				embedderIcAssemblerId: String,
				icIdentifier: String,
				fid: String
		},
		EF_CARD_CERTIFICATE: {
			size: Number,
				certificate: {
				certificate: {
					octetString: String
				}
			},
			fid: String
		},
		EF_APPLICATION_IDENTIFICATION: {
			size: Number,
				typeOfTachographCardId: {
				equipmentType: String
			},
			cardStructureVersion: {
				cardStructureVersion: String
			},
			noOfEventsPerType: {
				noOfEventsPerType: Number
			},
			noOfFaultsPerType: {
				noOfFaultsPerType: Number
			},
			activityStructureLength: {
				cardActivityLengthRange: Number
			},
			noOfCardVehicleRecords: {
				noOfCardVehicleRecords: Number
			},
			noOfCardPlaceRecords: {
				noOfCardPlaceRecords: Number
			},
			fid: String
		},
		EF_IDENTIFICATION: {
			size: Number,
				cardIssuingMemberState: String,
				cardNumber: {
				driverIdentification: String,
					drivercardReplacementIndex: Number,
					drivercardRenewalIndex: Number,
					ownerIdentification: Number,
					cardConsecutiveIndex: Number,
					cardReplacementIndex: Number,
					cardRenewalIndex: Number
			},
			cardIssuingAuthorityName: String,
				cardIssueDate: Date,
				cardValidityBegin: Date,
				cardExpiryDate: Date,
				driverCardHolderIdentification: {
					cardHolderName:{
						holderSurname: String ,
						holderFirstNames: String

					},
					cardHolderBirthDate: Date,
					cardHolderPreferredLanguage: String
			},
			fid: String
		},
		EF_FAULTS_DATA: {
			size: Number,
				cardFaultRecords: [
				{
					faultType: String,
					faultBeginTime: String,
					faultEndTime: String,
					faultVehicleRegistration: {
						vehicleRegistrationNation: String,
						vehicleRegistrationNumber: String
					}
				}

				],
				fid: String
		},
		EF_IC: {
			size: Number,
				icSerialNumber: String,
				icManufacturingReferneces: String,
				fid: String
		},
		EF_DRIVER_ACTIVITY_DATA: {
			size: Number,
				activityPointerOldestDayRecord: Number,
				activityPointerNewestRecord: Number,
				activityDailyRecords: [
				{
					activityPreviousRecordLength: Number,
					activityRecordLength: Number,
					activityRecordDate: Date,
					activityDailyPresenceCounter: Number,
					activityDayDistance: Number,
					activityChangeInfo: [
						{
							s: String,
							c: String,
							p: String,
							aa: String,
							t: String
						}

					]
				}


				],
				fid: String
		},
		EF_CONTROL_ACTIVITY_DATA: {
			size: Number,
			controlType: {
					c: String,
					v: String,
					p: String,
					d: String
			},
			controlTime: Date,
			controlCardNumber: {
				cardType: String,
				cardIssuingMemberState: String,
				cardNumber: {
					driverIdentification: String,
					drivercardReplacementIndex: String,
					drivercardRenewalIndex: String,
					ownerIdentification: String,
					cardConsecutiveIndex: String,
					cardReplacementIndex: String,
					cardRenewalIndex: String
				}
			},
			controlVehicleRegistration: {
				vehicleRegistrationNation: String,
					vehicleRegistrationNumber: String
			},
			controlDownloadPeriodBegin: Number,
			controlDownloadPeriodEnd: Number,
			fid: String
		},
		EF_VEHICLES_USED: {
			size: Number,
			vehiclePointerNewestRecord: Number,
			cardVehicleRecords: [
				{
				vehicleOdometerBegin: Number,
				vehicleOdometerEnd: Number,
				vehicleFirstUse: Date,
				vehicleLastUse: Date,
				vehicleRegistration: {
					vehicleRegistrationNation: String,
					vehicleRegistrationNumber: String
				},
				vuDataBlockCounter: Number
			}],
			noOfCardVehicleRecords: Number,
			fid: String
		},
		EF_SPECIFIC_CONDITIONS: {
			size: Number,
			entryTime: Number,
			specificConditionType: String,
			fid: String
		},
		EF_CA_CERTIFICATE: {
			size: Number,
			certificate: {
			certificate: {
				octetString: String
			}
		},
		fid: String
	},
		EF_EVENTS_DATA: {
			size: Number,
			cardEventRecords: [
			{
				eventType: String,
				eventBeginTime: Date,
				eventEndTime: Date,
				eventVehicleRegistration: String
			}

		],
			fid: String
		},
		EF_CURRENT_USAGE: {
			size: Number,
			sessionOpenTime: Date,
			sessionOpenVehicle: {
				vehicleRegistrationNation: String,
				vehicleRegistrationNumber: String
			},
			fid: String
		},
		EF_CARD_DOWNLOAD: {
			size: Number,
			lastcarddownload: Date,
			fid: String
		},
		EF_DRIVING_LICENSE_INFO: {
			size: Number,
			drivingLicenceIssuingAuthority: String,
			drivingLicenceIssuingNation: String,
			drivingLicenceNumber:String,
			fid: String
		}

	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});




mongoose.model('FileTgd', FileTgdSchema);

FileTgdSchema.pre('save',function(next){
	console.log("dentro de save");
	var self=this;
	var filetgd= mongoose.model('FileTgd', FileTgdSchema);
	filetgd.find({user : self.user,nameFile : self.nameFile},function(err,docs){
		if(err) {
			next(err);
		} else if(docs.length>0) {
			next(new Error('ya esxiste'));
		} else {
			console.log('no encontrado');
			next();
		}
	});

});


