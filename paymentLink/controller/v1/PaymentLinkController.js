const {
  generated_payment_link_validation_insertItem,
  update_payment_link_validation_insertItem,
} = require("../../models/PaymentLink");

const {
  generate_payment_link_mapper,
} = require("../../../paymentLinkMapper/models/PaymentLinkMapper");

const shortid = require("shortid");
const Joi = require('joi');
const DB = require("../../../common/couchdb");
const { SendMailClient } = require("zeptomail");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const getDetailsByOrderIdCashFree = require("../../../common/getDetailsByOrderIdOfCashFree");
const sendToLawsikhoOrSkillerbitra = require("../../../common/sendToLawsikhoOrSkillerbitra");
const cancelemailtemplate = require("../../../common/emailTemplate/Cancelemailtemplate");
const skillCancelEmail = require("../../../common/emailTemplate/SkillCancTemp");
const rejectemailtemplate = require("../../../common/emailTemplate/rejectemailtemplate");
const skillRejectEmail = require("../../../common/emailTemplate/skillRejectTemp");
const getDetailsByOrderIdRazorpay = require("../../../common/getDetailsByOrderIdRazorpay");

const url = process.env.ZEPTO_MAIL_URL;
const token = process.env.ZEPTO_MAIL_TOKEN;

const mailgun = require("mailgun-js");
const captureRazorpayPayment = require("../../../common/calltoRazorpayPaymentCapture");
const pushToQueue = require("../../../common/pushToQueue");
const { edit_payment_link_validation_insertItem } = require("../../models/EditPaymentLink");

// const generated_payment_link = async (req, res) => {
//     const userInfo =
//         (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
//         req.headers.authorization;

//     console.log("userInfo", userInfo)
//     try {
//         // Get the JSON payload from the request body
//         const payload = req.body;

//         console.log("payload before", payload)
//         payload.collectionName = "PaymentLink";
//         payload.paymentLinkGeneratedTime = new Date();
//         payload.price.paymentType = payload.price.paymentType.toLowerCase()
//         payload.courseType = payload.courseType.toLowerCase()

//         if (payload.price.originalPrice === payload.price.salesPrice) {
//             payload.approvalStatus = "approved"

//             payload.currentStatus = ["generated"]
//             payload.statusChangeHistory = [{
//                 statusName: "generated",
//                 changeTime: new Date(),
//                 changedBy: {
//                     refId: userInfo.userInfo.user_id,
//                     name: userInfo.userInfo.name,
//                     email: userInfo.userInfo.email,
//                     phone: userInfo.userInfo.phone,
//                 }
//             }]

//             console.log("payload after", payload)

//             // Call the insertItem function with the modified payload
//             const response = await generated_payment_link_validation_insertItem(payload);

//             // Check the response and send appropriate status and message
//             if (response.hasOwnProperty("ok")) {

//                 // Generate JWT token
//                 // payload.id = response.id

//                 const tokenPayload = {
//                     channel: payload.channelInfo || {},
//                     lead: payload.lead || {},
//                     courseType: payload.courseType || "",
//                     courseInfo: payload.courseInfo || {},
//                     coursePlanInfo: payload.coursePlanInfo || {},
//                     price: payload.price || {},
//                     currentStatus: payload.currentStatus || [""],
//                     selectedPaymentGateways: payload.selectedPaymentGateways || [],
//                     pageContent: payload.pageContent || "",
//                     paymentLinkExpireTime: payload.paymentLinkExpireTime,
//                     id: response.id
//                 };

//                 // Set token expiration based on paymentLinkExpireTime
//                 if (payload.paymentLinkExpireTime) {
//                     const expirationTimeInSeconds = Math.floor((new Date(payload.paymentLinkExpireTime) - new Date()) / 1000);

//                     const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

//                     let existingDoc = await DB.get(response.id);
//                     existingDoc.token = token;

//                     if (payload.channelInfo.name == 'Skillarbitra') {
//                         existingDoc.paymentLink = `https://payment-collect2.lawsikho.dev/payment?token=${token}`
//                     }

//                     if (payload.channelInfo.name == 'Lawsikho') {
//                         existingDoc.paymentLink = `https://payment-collect1.lawsikho.dev/payment?token=${token}`
//                     }
//                     // Save the updated document back to the database
//                     console.log("paymentLink", existingDoc.paymentLink)
//                     await DB.insert(existingDoc);
//                     console.log(existingDoc)

//                     return res.status(201).json({
//                         message: "PaymentLink generated Successfully",
//                         response,
//                         token
//                     });
//                 } else {
//                     const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

//                     let existingDoc = await DB.get(response.id);
//                     existingDoc.token = token;

//                     if (payload.channelInfo.name == 'Skillarbitra') {
//                         existingDoc.paymentLink = `https://payment-collect2.lawsikho.dev/payment?token=${token}`
//                     }

//                     if (payload.channelInfo.name == 'Lawsikho') {
//                         existingDoc.paymentLink = `https://payment-collect1.lawsikho.dev/payment?token=${token}`
//                     }
//                     // Save the updated document back to the database
//                     console.log("paymentLink", existingDoc.paymentLink)
//                     await DB.insert(existingDoc);
//                     console.log(existingDoc)
//                     return res.status(201).json({
//                         message: "PaymentLink generated Successfully",
//                         response,
//                         token
//                     });
//                 }

//             } else {
//                 res.status(400).json({
//                     message: "PaymentLink not generated",
//                     response: response.error.details
//                 });
//             }

//         } else {
//             payload.approvalStatus = "pending"

//             payload.currentStatus = ["initiated"]
//             payload.statusChangeHistory = [{
//                 statusName: "initiated",
//                 changeTime: new Date(),
//                 changedBy: {
//                     refId: userInfo.userInfo.user_id,
//                     name: userInfo.userInfo.name,
//                     email: userInfo.userInfo.email,
//                     phone: userInfo.userInfo.phone,
//                 }
//             }]

//             console.log("payload after", payload)

//             // Call the insertItem function with the modified payload
//             const response = await generated_payment_link_validation_insertItem(payload);

//             // Check the response and send appropriate status and message
//             if (response.hasOwnProperty("ok")) {

//                 // Generate JWT token
//                 // payload.id = response.id

//                 const tokenPayload = {
//                     channel: payload.channelInfo || {},
//                     lead: payload.lead || {},
//                     courseType: payload.courseType || "",
//                     courseInfo: payload.courseInfo || {},
//                     coursePlanInfo: payload.coursePlanInfo || {},
//                     price: payload.price || {},
//                     currentStatus: payload.currentStatus || [""],
//                     selectedPaymentGateways: payload.selectedPaymentGateways || [],
//                     pageContent: payload.pageContent || "",
//                     paymentLinkExpireTime: payload.paymentLinkExpireTime,
//                     id: response.id
//                 };

//                 // Set token expiration based on paymentLinkExpireTime
//                 if (payload.paymentLinkExpireTime) {
//                     const expirationTimeInSeconds = Math.floor((new Date(payload.paymentLinkExpireTime) - new Date()) / 1000);

//                     const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

//                     let existingDoc = await DB.get(response.id);
//                     existingDoc.token = token;

//                     // if (payload.channelInfo.name == 'Skillarbitra') {
//                     //     existingDoc.paymentLink = `https://payment-collect2.lawsikho.dev/payment?token=${token}`
//                     // }

//                     // if (payload.channelInfo.name == 'Lawsikho') {
//                     //     existingDoc.paymentLink = `https://payment-collect1.lawsikho.dev/payment?token=${token}`
//                     // }
//                     // // Save the updated document back to the database
//                     // console.log("paymentLink", existingDoc.paymentLink)
//                     await DB.insert(existingDoc);
//                     console.log(existingDoc)

//                     return res.status(201).json({
//                         message: "PaymentLink generated Successfully",
//                         response,
//                         token
//                     });
//                 } else {
//                     const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

//                     let existingDoc = await DB.get(response.id);
//                     existingDoc.token = token;

//                     // if (payload.channelInfo.name == 'Skillarbitra') {
//                     //     existingDoc.paymentLink = `https://payment-collect2.lawsikho.dev/payment?token=${token}`
//                     // }

//                     // if (payload.channelInfo.name == 'Lawsikho') {
//                     //     existingDoc.paymentLink = `https://payment-collect1.lawsikho.dev/payment?token=${token}`
//                     // }
//                     // // Save the updated document back to the database
//                     // console.log("paymentLink", existingDoc.paymentLink)
//                     await DB.insert(existingDoc);
//                     console.log(existingDoc)
//                     return res.status(201).json({
//                         message: "PaymentLink generated Successfully",
//                         response,
//                         token
//                     });
//                 }

//             } else {
//                 res.status(400).json({
//                     message: "PaymentLink not generated",
//                     response: response.error.details
//                 });
//             }

//         }

//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

const generated_payment_link = async (req, res) => {
  const userInfo =
    (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    req.headers.authorization;

  console.log("userInfo", userInfo);
  try {
    // Get the JSON payload from the request body
    const payload = req.body;

    // console.log("payload before", payload);
    payload.collectionName = "PaymentLink";
    payload.paymentLinkGeneratedTime = new Date();
    payload.price.paymentType = payload.price.paymentType.toLowerCase();
    payload.courseType = payload.courseType.toLowerCase();
    if (!payload.lead.phone.countryCode) {
      payload.lead.phone.countryCode = 91;
    }

    payload.lead.phone.contactedNumber = `+${payload.lead.phone.countryCode}${payload.lead.phone.phoneNo}`


    if (payload.price.originalPrice === payload.price.salesPrice) {
      payload.approvalStatus = "approved";

      payload.currentStatus = ["generated"];
      payload.statusChangeHistory = [{
        statusName: "generated",
        changeTime: new Date(),
        changedBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo?.email,
          // phone: userInfo.userInfo.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
          }
        }
      }];

      // Link is generated by
      payload.linkGeneratedBy = {
        refId: userInfo.userInfo.user_id,
        name: userInfo.userInfo?.name,
        email: userInfo.userInfo?.email,
        // phone: userInfo.userInfo?.phone,
        phone: {
          countryCode: userInfo.userInfo?.countryCode || 91,
          phoneNo: userInfo.userInfo?.phone,
          contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        }
      };
      ////=============================

      // console.log("payload after", payload);

      // Call the insertItem function with the modified payload
      const response = await generated_payment_link_validation_insertItem(payload);

      // Check the response and send appropriate status and message
      if (response.hasOwnProperty("ok")) {
        // Generate JWT token
        const tokenPayload = {
          channel: payload.channelInfo || {},
          lead: payload.lead || {},
          courseType: payload.courseType || "",
          courseInfo: payload.courseInfo || {},
          coursePlanInfo: payload.coursePlanInfo || {},
          price: payload.price || {},
          currentStatus: payload.currentStatus || [""],
          selectedPaymentGateways: payload.selectedPaymentGateways || [],
          pageContent: payload.pageContent || "",
          paymentLinkExpireTime: payload.paymentLinkExpireTime,
          id: response.id
        };

        // Set token expiration based on paymentLinkExpireTime
        //     const expirationTimeInSeconds = payload.paymentLinkExpireTime ?
        //         Math.floor((new Date(payload.paymentLinkExpireTime) - new Date()) / 1000) :
        //         undefined;

        //     const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {
        //         expiresIn: expirationTimeInSeconds
        //     });

        //     let existingDoc = await DB.get(response.id);
        //     existingDoc.token = token;

        //     // Set paymentLink based on channelInfo.name
        //     if (payload.channelInfo.name == 'Skillarbitra') {
        //         existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
        //     } else if (payload.channelInfo.name == 'Lawsikho') {
        //         existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
        //     }

        //     // Save the updated document back to the database
        //     await DB.insert(existingDoc);

        //     return res.status(201).json({
        //         message: "PaymentLink generated Successfully",
        //         response,
        //         token
        //     });
        // } else {
        //     res.status(400).json({
        //         message: "PaymentLink not generated",
        //         response: response.error.details
        //     });
        // }

        // Set token expiration based on paymentLinkExpireTime
        if (payload.paymentLinkExpireTime) {
          console.log("Bye")
          const expirationTimeInSeconds = Math.floor((new Date(payload.paymentLinkExpireTime) - new Date()) / 1000);

          const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

          let existingDoc = await DB.get(response.id);
          existingDoc.token = token;

          if (payload.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`
          }

          if (payload.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`
          }
          // Save the updated document back to the database
          console.log("paymentLink", existingDoc.paymentLink)
          await DB.insert(existingDoc);
          console.log(existingDoc)

          return res.status(201).json({
            message: "PaymentLink generated Successfully",
            response,
            token
          });
        } if (!payload.paymentLinkExpireTime) {
          console.log("hey")
          const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

          let existingDoc = await DB.get(response.id);
          existingDoc.token = token;

          if (payload.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`
          }

          if (payload.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`
          }
          // Save the updated document back to the database
          console.log("paymentLink", existingDoc.paymentLink)
          await DB.insert(existingDoc);
          console.log(existingDoc)
          return res.status(201).json({
            message: "PaymentLink generated Successfully",
            response,
            token
          });
        }

      } else {
        res.status(400).json({
          message: response.error.details[0].message || "PaymentLink not generated",
          response: response.error.details
        });
      }

    } else {
      payload.approvalStatus = "pending";

      payload.currentStatus = ["generated"];
      payload.statusChangeHistory = [{
        statusName: "generated",
        changeTime: new Date(),
        changedBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo?.email,
          // phone: userInfo.userInfo?.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
          }
        }
      }];

      // Link is generated by
      payload.linkGeneratedBy = {
        refId: userInfo.userInfo?.user_id,
        name: userInfo.userInfo?.name,
        email: userInfo.userInfo?.email,
        // phone: userInfo.userInfo?.phone,
        phone: {
          countryCode: userInfo.userInfo?.countryCode || 91,
          phoneNo: userInfo.userInfo?.phone,
          contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        }
      };
      ////=============================

      // console.log("payload after", payload);

      // Call the insertItem function with the modified payload
      const response = await generated_payment_link_validation_insertItem(payload);

      // Check the response and send appropriate status and message
      if (response.hasOwnProperty("ok")) {
        // Generate JWT token
        const tokenPayload = {
          channel: payload.channelInfo || {},
          lead: payload.lead || {},
          courseType: payload.courseType || "",
          courseInfo: payload.courseInfo || {},
          coursePlanInfo: payload.coursePlanInfo || {},
          price: payload.price || {},
          currentStatus: payload.currentStatus || [""],
          selectedPaymentGateways: payload.selectedPaymentGateways || [],
          pageContent: payload.pageContent || "",
          paymentLinkExpireTime: payload.paymentLinkExpireTime,
          id: response.id
        };

        // Set token expiration based on paymentLinkExpireTime
        //     const expirationTimeInSeconds = payload.paymentLinkExpireTime ?
        //         Math.floor((new Date(payload.paymentLinkExpireTime) - new Date()) / 1000) :
        //         undefined;

        //     const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {
        //         expiresIn: expirationTimeInSeconds
        //     });

        //     let existingDoc = await DB.get(response.id);
        //     existingDoc.token = token;

        //     // Set paymentLink based on channelInfo.name
        //     if (payload.channelInfo.name == 'Skillarbitra') {
        //         existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
        //     } else if (payload.channelInfo.name == 'Lawsikho') {
        //         existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
        //     }

        //     // Save the updated document back to the database
        //     await DB.insert(existingDoc);

        //     console.log(existingDoc)

        //     return res.status(201).json({
        //         message: "PaymentLink generated Successfully, pending for approval",
        //         response,
        //         token
        //     });
        // } else {
        //     res.status(400).json({
        //         message: "PaymentLink not generated",
        //         response: response.error.details
        //     });
        // }
        if (payload.paymentLinkExpireTime) {
          console.log("Bye")
          const expirationTimeInSeconds = Math.floor((new Date(payload.paymentLinkExpireTime) - new Date()) / 1000);

          const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

          let existingDoc = await DB.get(response.id);
          existingDoc.token = token;

          if (payload.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`
          }

          if (payload.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`
          }
          // Save the updated document back to the database
          console.log("paymentLink", existingDoc.paymentLink)
          await DB.insert(existingDoc);
          console.log(existingDoc)

          return res.status(201).json({
            message: "PaymentLink generated Successfully",
            response,
            token
          });
        } if (!payload.paymentLinkExpireTime) {
          console.log("hey")
          const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

          let existingDoc = await DB.get(response.id);
          existingDoc.token = token;

          if (payload.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`
          }

          if (payload.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`
          }
          // Save the updated document back to the database
          console.log("paymentLink", existingDoc.paymentLink)
          await DB.insert(existingDoc);
          console.log(existingDoc)
          return res.status(201).json({
            message: "PaymentLink generated Successfully",
            response,
            token
          });
        }

      } else {
        res.status(400).json({
          message: response.error.details[0].message || "PaymentLink not generated",
          response: response.error.details
        });
      }
    }

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const cancel_payment_link = async (req, res) => {
  try {
    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    console.log("userInfo", userInfo);
    const id = req.params.id;
    console.log(id);

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === "not_found") {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    const previousStatus = existingDoc.currentStatus;
    // Update the field in the payload
    existingDoc.currentStatus = ["deleted"];

    existingDoc.statusChangeHistory.push({
      statusName: "deleted",
      changeTime: new Date(),
      changedBy: {
        refId: userInfo.userInfo?.user_id,
        name: userInfo.userInfo?.name,
        email: userInfo.userInfo?.email,
        // phone: userInfo.userInfo.phone,
        phone: {
          countryCode: userInfo.userInfo?.countryCode || 91,
          phoneNo: userInfo.userInfo?.phone,
          contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        }
      }
    });

    const tokenPayload = {
      channel: existingDoc.channelInfo || {},
      lead: existingDoc.lead || {},
      courseType: existingDoc.courseType || "",
      courseInfo: existingDoc.courseInfo || {},
      coursePlanInfo: existingDoc.coursePlanInfo || {},
      price: existingDoc.price || {},
      currentStatus: existingDoc.currentStatus || [""],
      selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
      pageContent: existingDoc.pageContent || "",
      paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
      id: existingDoc._id,
    };

    // Set token expiration based on paymentLinkExpireTime
    if (existingDoc.paymentLinkExpireTime) {
      const expirationTimeInSeconds = Math.floor(
        (new Date(existingDoc.paymentLinkExpireTime) - new Date()) / 1000
      );

      const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {
        expiresIn: expirationTimeInSeconds,
      });

      console.log("1", token);
      // let existingDoc = await DB.get(response.id);
      existingDoc.token = token;

      if (existingDoc.channelInfo?.name) {
        if (existingDoc.channelInfo.name == "Skillarbitra") {
          existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
        }
        if (existingDoc.channelInfo.name == "Lawsikho") {
          existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
        }
      }
    } else {
      const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);
      console.log("2", token);
      // let existingDoc = await DB.get(response.id);
      existingDoc.token = token;

      if (existingDoc.channelInfo?.name) {
        if (existingDoc.channelInfo.name == "Skillarbitra") {
          existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
        }
        if (existingDoc.channelInfo.name == "Lawsikho") {
          existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
        }
      }
    }

    console.log("existing docs", existingDoc);

    // Save the updated document back to the database
    const response = await DB.insert(existingDoc);

    if (response.ok) {
      // Send email using ZeptoMail
      // Create a ZeptoMail client
      //const zeptoMailClient = new SendMailClient({ url, token });

      let modifiedUserHTML;
      let fromEmail;

      let newapiKey;
      let newdomain;

      if (existingDoc.channelInfo.lsSaRefId == "1") {
        (newapiKey = process.env.LAWSIKHO_KEY),
          (newdomain = process.env.LAWSIKHO_DOMAIN),
          (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
        modifiedUserHTML = cancelemailtemplate.replace(
          /{name}/g,
          existingDoc.lead.name
        );
        modifiedUserHTML = modifiedUserHTML.replace(
          /{logoImage}/g,
          "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
        );
      } else if (existingDoc.channelInfo.lsSaRefId == "2") {
        (newapiKey = process.env.SKILLARBITRAGE_KEY),
          (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
          (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
        modifiedUserHTML = skillCancelEmail.replace(
          /{name}/g,
          existingDoc.lead.name
        );
        modifiedUserHTML = modifiedUserHTML.replace(
          /{logoImage}/g,
          "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
        );
      } else {
        (newapiKey = process.env.LAWSIKHO_KEY),
          (newdomain = process.env.LAWSIKHO_DOMAIN),
          (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
        modifiedUserHTML = cancelemailtemplate.replace(
          /{name}/g,
          existingDoc.lead.name
        );
        modifiedUserHTML = modifiedUserHTML.replace(
          /{logoImage}/g,
          "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
        );
      }

      let mg;

      if (existingDoc.channelInfo.lsSaRefId == "1") {
        console.log("before", mailgun);
        mg = mailgun({
          apiKey: newapiKey,
          domain: newdomain,
        });
      } else {
        console.log("before", mailgun);
        mg = mailgun({
          apiKey: newapiKey,
          domain: newdomain,
          host: process.env.SKILLARBITRA_HOST,
        });
      }

      modifiedUserHTML = modifiedUserHTML.replace(
        /{amount}/g,
        existingDoc.price.paymentToBeCollected
      );

      // Define email content for cancellation
      const cancellationEmailContent = {
        from: fromEmail,
        to: existingDoc.lead.email,
        subject: "Notification of payment link cancellation",
        text: "Your PaymentLink has been canceled.",
        html: modifiedUserHTML,
      };

      if (previousStatus.includes('shared')) {
        // Send cancellation email
        const data = await mg.messages().send(cancellationEmailContent);
        console.log(data, "email sent successfully");
      }

      res.status(200).json({
        message: "PaymentLink cancelled successfully",
        response,
      });
    } else {
      res.status(500).json({
        message: "Failed to cancel PaymentLink",
        response: response.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


const getPaymentLinkById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);

      res.status(200).json({
        existingDoc: existingDoc,
      });
    } catch (error) {
      if (error.statusCode === 404 && error.error === "not_found") {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const change_status_to_paid = async (req, res) => {
  try {
    // const userInfo =
    //     (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    //     req.headers.authorization;

    // console.log("userInfo", userInfo)

    const id = req.params.id;
    console.log(id);

    var paymentOrderDetils;
    var razorpayPaymentDetails;

    const payload = req.body

    if (!payload.paymentCapturedInfo) {
      // Respond to the client or do other actions based on the API response
      return res.status(400).json({ success: false, message: 'Please provide paymentCapturedInfo in payload' });
    }
    if (!payload.channelId) {
      // Respond to the client or do other actions based on the API response
      return res.status(400).json({ success: false, message: 'Please provide channelId in payload' });
    }

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === 'not_found') {
        return res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    if (existingDoc.currentStatus.includes("paid")) {
      return res.status(400).json({
        message: "Already Paid",
      });
    }


    // Update the field in the payload
    existingDoc.currentStatus = ["paid"];
    existingDoc.paymentCaptureTime = new Date();

    existingDoc.statusChangeHistory.push(
      {
        statusName: "paid",
        changeTime: new Date(),
        changedBy: {
          refId: payload.refId || null,
          name: payload.name || null,
          email: payload.email || null,
          // phone: payload.phone || null,
          phone: {
            countryCode: payload.countryCode || 91,
            phoneNo: payload.phoneNo || null,
            contactedNumber: `${payload.countryCode || 91 + payload.phoneNo}`
          }
        }
      }
    )

    if (existingDoc.hasOwnProperty('approvalStatus') && existingDoc.approvalStatus == "pending") {
      existingDoc.approvalStatus = "na";
    }

    // FOR CASHFREE
    if (payload.paymentCapturedInfo.gatewayName === 'cashfree') {
      const orderDetails = await getDetailsByOrderIdCashFree(payload.paymentCapturedInfo.gatewayOrderRef, payload.channelId)
      paymentOrderDetils = orderDetails
      console.log('orderDetails:', orderDetails)

      const logPayload = { response: orderDetails }
      logPayload.timestamp = new Date()
      logPayload.collectionName = 'Log'
      logPayload.paymentGatewayName = 'cashfree'
      logPayload.paymentLinkId = id
      logPayload.tag = 'get_order_details_by_id'
      const logResponse = await DB.insert(logPayload);

      // Check the response and send appropriate status and message
      if (logResponse.hasOwnProperty("ok")) {
        console.log("Log created sucessfully")
      } else {
        console.log("Log not created")
      }

      if (paymentOrderDetils.order_status !== 'PAID') {
        // Respond to the client or do other actions based on the API response
        return res.status(400).json({ success: false, message: 'order_status is not PAID' });
      }



      existingDoc.paymentCapturedInfo = payload.paymentCapturedInfo;
      existingDoc.payee = {
        name: orderDetails.customer_details.customer_name,
        email: orderDetails.customer_details.customer_email,
        // phone: orderDetails.customer_details.customer_phone
        phone: {
          countryCode: 91, // sending null because not getting countryCode in orderDetails
          phoneNo: orderDetails.customer_details.customer_phone || null,
          contactedNumber: `+91${orderDetails.customer_details.customer_phone}`
        }
      }
    }

    // FOR RAZORPAY
    if (payload.paymentCapturedInfo.gatewayName === 'razorpay') {
      const orderDetails = await getDetailsByOrderIdRazorpay(payload.paymentCapturedInfo.gatewayPaymentRef, payload.channelId)
      razorpayPaymentDetails = orderDetails
      console.log('RAZORPAY orderDetails:', orderDetails)
      const logPayload = { response: razorpayPaymentDetails }
      logPayload.timestamp = new Date()
      logPayload.collectionName = 'Log'
      logPayload.paymentGatewayName = 'razorpay'
      logPayload.paymentLinkId = id
      logPayload.tag = 'get_order_details_by_id'
      const logResponse = await DB.insert(logPayload);

      // Check the response and send appropriate status and message
      if (logResponse.hasOwnProperty("ok")) {
        console.log("Log created sucessfully")
      } else {
        console.log("Log not created")
      }
      const paymentCapturePayload = {
        amount: razorpayPaymentDetails.amount,
        currency: "INR"
      };
      console.log(paymentCapturePayload, "testingggg")
      const paymentCaptureResponse = await captureRazorpayPayment(razorpayPaymentDetails.id, payload.channelId, paymentCapturePayload, id)

      console.log("orderDetails?.notes?.email", orderDetails?.notes?.email)
      console.log("orderDetails?.notes?.name", orderDetails?.notes?.name)
      console.log("orderDetails?.notes?.phone", orderDetails?.notes?.phone)
      existingDoc.paymentCapturedInfo = payload.paymentCapturedInfo;
      existingDoc.payee = {
        name: orderDetails?.notes?.name,
        email: orderDetails?.notes?.email,
        // phone: orderDetails.contact
        phone: {
          countryCode: 91, // sending null because not getting countryCode in orderDetails
          phoneNo: orderDetails?.notes?.phone || null,
          contactedNumber: `+91${orderDetails?.notes?.phone}`
        }
      }
    }


    console.log("existingDoc 2", existingDoc)

    // Save the updated document back to the database
    const response = await DB.insert(existingDoc);

    if (response.ok) {

      const existingDoc = await DB.get(id);

      console.log("existingDocs:", existingDoc)
      // FOR CASHFREE
      if (payload.paymentCapturedInfo.gatewayName === 'cashfree') {
        // LAWSIKHO
        if (payload.channelId === 1 || payload.channelId === '1') {

          console.log("paymentOrderDetils: ", paymentOrderDetils)

          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "lawsikho",
          //     "channelRqParams": {
          //         "order_date": paymentOrderDetils.created_at,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(paymentOrderDetils.order_amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": paymentOrderDetils.customer_details.customer_name,
          //         "user_email": paymentOrderDetils.customer_details.customer_email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }

          const lawsikhoOrSkillerbitraPayload = {
            "email": paymentOrderDetils.customer_details.customer_email,
            "name": paymentOrderDetils.customer_details.customer_name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
            "brand_id": "1",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": paymentOrderDetils.created_at,
                "paymentMode": "Online",
                "feePaid": parseInt(paymentOrderDetils.order_amount), //ammout
                "totalFeesPaid": parseInt(paymentOrderDetils.order_amount), //ammout,
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 3,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": paymentOrderDetils.order_id,
                "entryType": 1,
                "brand_id": "1",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }
          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, paymentOrderDetils)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }

        //SKILLERBITRA
        if (payload.channelId === 2 || payload.channelId === '2') {

          console.log("paymentOrderDetils: ", paymentOrderDetils)

          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "skillarbitra",
          //     "channelRqParams": {
          //         "order_date": paymentOrderDetils.created_at,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(paymentOrderDetils.order_amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": paymentOrderDetils.customer_details.customer_name,
          //         "user_email": paymentOrderDetils.customer_details.customer_email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }

          const lawsikhoOrSkillerbitraPayload = {
            "email": paymentOrderDetils.customer_details.customer_email,
            "name": paymentOrderDetils.customer_details.customer_name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
            "brand_id": "2",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": paymentOrderDetils.created_at,
                "paymentMode": "Online",
                "feePaid": parseInt(paymentOrderDetils.order_amount), //ammout
                "totalFeesPaid": parseInt(paymentOrderDetils.order_amount), //ammout
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 3,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": paymentOrderDetils.order_id,
                "entryType": 1,
                "brand_id": "2",
                "payment_system": 1,
                "payment_system_id": id

              }
            ]
          }

          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, paymentOrderDetils)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }
      }

      // FOR RAZORPAY
      if (payload.paymentCapturedInfo.gatewayName === 'razorpay') {
        // LAWSIKHO
        if (payload.channelId === 1 || payload.channelId === '1') {

          console.log("razorpayPaymentDetails: ", razorpayPaymentDetails)

          const timestamp = razorpayPaymentDetails.created_at;
          const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

          // Format the date as a string in the desired format
          const formattedDate = date.toISOString();

          console.log(formattedDate);

          const amount = razorpayPaymentDetails.amount / 100
          console.log(amount)


          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "lawsikho",
          //     "channelRqParams": {
          //         "order_date": formattedDate,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": payload.name,
          //         "user_email": razorpayPaymentDetails.email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(payload.phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }

          const lawsikhoOrSkillerbitraPayload = {
            "email": razorpayPaymentDetails.notes?.email || razorpayPaymentDetails.email,
            "name": payload.name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(payload.phone),
            "brand_id": "1",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": formattedDate,
                "paymentMode": "Online",
                "feePaid": parseInt(amount), //ammout
                "totalFeesPaid": parseInt(amount), //ammout,
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 9,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": razorpayPaymentDetails.order_id,
                "entryType": 1,
                "brand_id": "1",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }

          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, razorpayPaymentDetails)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }

        //SKILLERBITRA
        if (payload.channelId === 2 || payload.channelId === '2') {

          console.log("paymentOrderDetils: ", paymentOrderDetils)

          const timestamp = razorpayPaymentDetails.created_at;
          const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

          // Format the date as a string in the desired format
          const formattedDate = date.toISOString();

          console.log(formattedDate);

          const amount = razorpayPaymentDetails.amount / 100
          console.log(amount)


          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "skillarbitra",
          //     "channelRqParams": {
          //         "order_date": formattedDate,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": payload.name,
          //         "user_email": razorpayPaymentDetails.email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(payload.phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }


          const lawsikhoOrSkillerbitraPayload = {
            "email": razorpayPaymentDetails.notes?.email || razorpayPaymentDetails.email,
            "name": payload.name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(payload.phone),
            "brand_id": "2",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": formattedDate,
                "paymentMode": "Online",
                "feePaid": parseInt(amount), //ammout
                "totalFeesPaid": parseInt(amount), //ammout,
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 9,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": razorpayPaymentDetails.order_id,
                "entryType": 1,
                "brand_id": "2",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }
          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, razorpayPaymentDetails)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }
      }


    } else {
      return res.status(500).json({
        message: "Failed to change status",
        response: response.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



const change_status_to_processing = async (req, res) => {
  try {
    // const userInfo =
    //     (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    //     req.headers.authorization;

    // console.log("userInfo", userInfo)

    const id = req.params.id;
    console.log(id);


    const payload = req.body

    if (!payload.currentStatus) {
      // Respond to the client or do other actions based on the API response
      return res.status(400).json({ success: false, message: 'Please provide currentStatus in payload' });
    }

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === 'not_found') {
        return res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    if (existingDoc.currentStatus.includes("processing")) {
      return res.status(400).json({
        message: "Already processing",
      });
    }

    if (existingDoc.currentStatus.includes("paid")) {
      return res.status(400).json({
        message: "Already Paid",
      });
    }


    // Update the field in the payload
    existingDoc.currentStatus = ["processing"];

    existingDoc.statusChangeHistory.push(
      {
        statusName: "processing",
        changeTime: new Date(),
        changedBy: {
          refId: null,
          name: "webhook",
          email: null,
          // phone: payload.phone || null,
          phone: {
            countryCode: null,
            phoneNo: null,
            contactedNumber: null
          }
        }
      }
    )



    // Save the updated document back to the database
    const response = await DB.insert(existingDoc);

    if (response.ok) {

      const existingDoc = await DB.get(id);

      console.log("existingDocs:", existingDoc)


      return res.status(200).json({
        message: "Change status to processing sucessfully",
        response: existingDoc
      });

    } else {
      return res.status(500).json({
        message: "Failed to change status",
        response: response.error
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const change_status_to_paid_webhook = async (req, res) => {
  try {
    // Wait for 10 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 10000));

    const payload = req.body

    console.log(payload)

    console.log("payload webhook", payload.gateway_name)

    if (!payload.gateway_name) {
      // Respond to the client or do other actions based on the API response
      return res.status(400).json({ success: false, message: 'Please provide gatewayName in payload' });
    }

    if (payload.gateway_name == 'Razorpay') {
      const id = payload.request_payload?.payload?.payment?.entity?.notes?.paymentLinkId;
      console.log(id);

      var paymentOrderDetils;
      var razorpayPaymentDetails;

      // Retrieve existing document
      let existingDoc;
      try {
        existingDoc = await DB.get(id);
      } catch (error) {
        if (error.statusCode === 404 && error.error === 'not_found') {
          return res.status(404).json({
            message: "PaymentLink not found",
          });
          return;
        } else {
          throw error; // rethrow other errors
        }
      }

      if (existingDoc.currentStatus.includes("paid")) {
        return res.status(400).json({
          message: "Already Paid",
        });
      }


      // Update the field in the payload
      existingDoc.currentStatus = ["paid"];
      existingDoc.paymentCaptureTime = new Date();

      existingDoc.statusChangeHistory.push(
        {
          statusName: "paid",
          changeTime: new Date(),
          changedBy: {
            refId: payload.request_payload?.payload?.payment?.entity?.notes?.refId || null,
            name: payload.request_payload?.payload?.payment?.entity?.notes?.name || null,
            email: payload.request_payload?.payload?.payment?.entity?.notes?.email || null,
            // phone: payload.phone || null,
            phone: {
              countryCode: payload.request_payload?.payload?.payment?.entity?.notes?.countryCode || 91,
              phoneNo: payload.request_payload?.payload?.payment?.entity?.notes?.phone || null,
              contactedNumber: `${payload.request_payload?.payload?.payment?.entity?.notes?.countryCode || 91 + payload.request_payload?.payload?.payment?.entity?.notes?.phone}`
            }
          }
        }
      )

      if (existingDoc.hasOwnProperty('approvalStatus') && existingDoc.approvalStatus == "pending") {
        existingDoc.approvalStatus = "na";
      }



      const orderDetails = await getDetailsByOrderIdRazorpay(payload.request_payload?.payload?.payment?.entity?.id, payload.request_payload?.payload.payment?.entity?.notes?.channelId)
      razorpayPaymentDetails = orderDetails
      console.log('RAZORPAY orderDetails:', orderDetails)

      const logPayload = { response: razorpayPaymentDetails }
      logPayload.timestamp = new Date()
      logPayload.collectionName = 'Log'
      logPayload.paymentGatewayName = 'razorpay'
      logPayload.paymentLinkId = id
      logPayload.tag = 'get_order_details_by_id'
      const logResponse = await DB.insert(logPayload);

      // Check the response and send appropriate status and message
      if (logResponse.hasOwnProperty("ok")) {
        console.log("Log created sucessfully")
      } else {
        console.log("Log not created")
      }

      const paymentCapturePayload = {
        amount: razorpayPaymentDetails.amount,
        currency: "INR"
      };
      console.log(paymentCapturePayload, "testingggg")
      const paymentCaptureResponse = await captureRazorpayPayment(razorpayPaymentDetails.id, payload.request_payload?.payload?.payment?.entity?.notes?.channelId, paymentCapturePayload, id)

      existingDoc.paymentCapturedInfo = {
        "gatewayName": "razorpay",
        "gatewayPaymentRef": razorpayPaymentDetails.id,
        "updatedFrom": "webhook"
      };

      console.log("orderDetails?.notes?.email", orderDetails?.notes?.email)
      console.log("orderDetails?.notes?.name", orderDetails?.notes?.name)
      console.log("orderDetails?.notes?.phone", orderDetails?.notes?.phone)
      existingDoc.payee = {
        name: payload.request_payload?.payload?.payment?.entity?.notes?.name,
        email: orderDetails?.notes?.email,
        // phone: orderDetails.contact
        phone: {
          countryCode: 91, // sending null because not getting countryCode in orderDetails
          phoneNo: orderDetails?.notes?.phone || null,
          contactedNumber: `+91${orderDetails?.notes?.phone}`
        }
      }


      // Save the updated document back to the database
      const response = await DB.insert(existingDoc);

      if (response.ok) {

        const existingDoc = await DB.get(id);

        console.log("existingDocs:", existingDoc)

        // FOR RAZORPAY
        // LAWSIKHO
        if (payload.request_payload?.payload?.payment?.entity?.notes?.channelId === 1 || payload.request_payload?.payload?.payment?.entity?.notes?.channelId === '1') {

          console.log("razorpayPaymentDetails: ", razorpayPaymentDetails)

          const timestamp = razorpayPaymentDetails.created_at;
          const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

          // Format the date as a string in the desired format
          const formattedDate = date.toISOString();

          console.log(formattedDate);

          const amount = razorpayPaymentDetails.amount / 100
          console.log(amount)


          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "lawsikho",
          //     "channelRqParams": {
          //         "order_date": formattedDate,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": payload.name,
          //         "user_email": razorpayPaymentDetails.email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(payload.phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }

          const lawsikhoOrSkillerbitraPayload = {
            "email": razorpayPaymentDetails.notes?.email || razorpayPaymentDetails.email,
            "name": payload.request_payload?.payload?.payment?.entity?.notes?.name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(payload.request_payload?.payload?.payment?.entity?.notes?.phone),
            "brand_id": "1",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": formattedDate,
                "paymentMode": "Online",
                "feePaid": parseInt(amount), //ammout
                "totalFeesPaid": parseInt(amount), //ammout,
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 9,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": razorpayPaymentDetails.order_id,
                "entryType": 1,
                "brand_id": "1",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }

          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, razorpayPaymentDetails)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }

        //SKILLERBITRA
        if (payload.request_payload?.payload?.payment?.entity?.notes?.channelId === 2 || payload.request_payload?.payload?.payment?.entity?.notes?.channelId === '2') {

          console.log("paymentOrderDetils: ", paymentOrderDetils)

          const timestamp = razorpayPaymentDetails.created_at;
          const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

          // Format the date as a string in the desired format
          const formattedDate = date.toISOString();

          console.log(formattedDate);

          const amount = razorpayPaymentDetails.amount / 100
          console.log(amount)


          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "skillarbitra",
          //     "channelRqParams": {
          //         "order_date": formattedDate,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": payload.name,
          //         "user_email": razorpayPaymentDetails.email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(payload.phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }


          const lawsikhoOrSkillerbitraPayload = {
            "email": razorpayPaymentDetails.notes?.email || razorpayPaymentDetails.email,
            "name": payload.request_payload?.payload?.payment?.entity?.notes?.name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(payload.request_payload?.payload?.payment?.entity?.notes?.phone),
            "brand_id": "2",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": formattedDate,
                "paymentMode": "Online",
                "feePaid": parseInt(amount), //ammout
                "totalFeesPaid": parseInt(amount), //ammout,
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 9,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": razorpayPaymentDetails.order_id,
                "entryType": 1,
                "brand_id": "2",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }
          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, razorpayPaymentDetails)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }



      } else {
        return res.status(500).json({
          message: "Failed to change status",
          response: response.error
        });
      }
    }

    if (payload.gateway_name == 'Cashfree') {
      const id = payload.request_payload?.data?.customer_details?.customer_id;
      console.log(id);

      var paymentOrderDetils;
      var razorpayPaymentDetails;

      // const payload = req.body

      // Retrieve existing document
      let existingDoc;
      try {
        existingDoc = await DB.get(id);
      } catch (error) {
        if (error.statusCode === 404 && error.error === 'not_found') {
          return res.status(404).json({
            message: "PaymentLink not found",
          });
          return;
        } else {
          throw error; // rethrow other errors
        }
      }

      if (existingDoc.currentStatus.includes("paid")) {
        return res.status(400).json({
          message: "Already Paid",
        });
      }


      // Update the field in the payload
      existingDoc.currentStatus = ["paid"];
      existingDoc.paymentCaptureTime = new Date();

      existingDoc.statusChangeHistory.push(
        {
          statusName: "paid",
          changeTime: new Date(),
          changedBy: {
            refId: payload.request_payload?.data?.customer_details?.refId || null,
            name: payload.request_payload?.data?.customer_details?.customer_name || null,
            email: payload.request_payload?.data?.customer_details?.customer_email || null,
            // phone: payload.phone || null,
            phone: {
              countryCode: payload.request_payload?.data?.customer_details?.customer_country_code || 91,
              phoneNo: payload.request_payload?.data?.customer_details?.customer_phone || null,
              contactedNumber: `${payload.request_payload?.data?.customer_details?.customer_country_code || 91 + payload.request_payload?.data?.customer_details?.customer_phone}`
            }
          }
        }
      )

      if (existingDoc.hasOwnProperty('approvalStatus') && existingDoc.approvalStatus == "pending") {
        existingDoc.approvalStatus = "na";
      }

      // FOR CASHFREE
      const orderDetails = await getDetailsByOrderIdCashFree(payload.request_payload?.data?.order?.order_id, existingDoc.channelInfo.lsSaRefId)
      paymentOrderDetils = orderDetails
      console.log('orderDetails:', orderDetails)

      const logPayload = { response: orderDetails }
      logPayload.timestamp = new Date()
      logPayload.collectionName = 'Log'
      logPayload.paymentGatewayName = 'cashfree'
      logPayload.paymentLinkId = id
      logPayload.tag = 'get_order_details_by_id'
      const logResponse = await DB.insert(logPayload);

      // Check the response and send appropriate status and message
      if (logResponse.hasOwnProperty("ok")) {
        console.log("Log created sucessfully")
      } else {
        console.log("Log not created")
      }

      if (paymentOrderDetils.order_status !== 'PAID') {
        // Respond to the client or do other actions based on the API response
        return res.status(400).json({ success: false, message: 'order_status is not PAID' });
      }


      existingDoc.paymentCapturedInfo = {
        "gatewayName": "cashfree",
        "gatewayOrderRef": payload.request_payload?.data?.order?.order_id,
        "updatedFrom": "webhook"
      };
      existingDoc.payee = {
        name: orderDetails.customer_details.customer_name,
        email: orderDetails.customer_details.customer_email,
        // phone: orderDetails.customer_details.customer_phone
        phone: {
          countryCode: 91, // sending null because not getting countryCode in orderDetails
          phoneNo: orderDetails.customer_details.customer_phone || null,
          contactedNumber: `+91${orderDetails.customer_details.customer_phone}`
        }
      }



      // Save the updated document back to the database
      const response = await DB.insert(existingDoc);

      if (response.ok) {

        const existingDoc = await DB.get(id);

        console.log("existingDocs:", existingDoc)
        // FOR CASHFREE
        // LAWSIKHO
        if (existingDoc.channelInfo.lsSaRefId === 1 || existingDoc.channelInfo.lsSaRefId === '1') {

          console.log("paymentOrderDetils: ", paymentOrderDetils)

          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "lawsikho",
          //     "channelRqParams": {
          //         "order_date": paymentOrderDetils.created_at,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(paymentOrderDetils.order_amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": paymentOrderDetils.customer_details.customer_name,
          //         "user_email": paymentOrderDetils.customer_details.customer_email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }

          const lawsikhoOrSkillerbitraPayload = {
            "email": paymentOrderDetils.customer_details.customer_email,
            "name": paymentOrderDetils.customer_details.customer_name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
            "brand_id": "1",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": paymentOrderDetils.created_at,
                "paymentMode": "Online",
                "feePaid": parseInt(paymentOrderDetils.order_amount), //ammout
                "totalFeesPaid": parseInt(paymentOrderDetils.order_amount), //ammout,
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 3,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": paymentOrderDetils.order_id,
                "entryType": 1,
                "brand_id": "1",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }
          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, paymentOrderDetils)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }

        //SKILLERBITRA
        if (existingDoc.channelInfo.lsSaRefId === 2 || existingDoc.channelInfo.lsSaRefId === '2') {

          console.log("paymentOrderDetils: ", paymentOrderDetils)

          // const lawsikhoOrSkillerbitraPayload = {
          //     "channelid": "skillarbitra",
          //     "channelRqParams": {
          //         "order_date": paymentOrderDetils.created_at,
          //         "course_id": existingDoc.courseType == 'standalone' || existingDoc.courseType == 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "offer_id": existingDoc.courseType != 'standalone' && existingDoc.courseType != 'package' ? parseInt(existingDoc.courseInfo.lsSaId) : null,
          //         "course_plan_id": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null,
          //         "amount": parseInt(paymentOrderDetils.order_amount),
          //         "payment_status": 'PAID',
          //         "status": "A",
          //         "user_source": "",
          //         "user_name": paymentOrderDetils.customer_details.customer_name,
          //         "user_email": paymentOrderDetils.customer_details.customer_email,
          //         "country_code": existingDoc.payee.countryCode,
          //         "user_phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
          //         "order_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offers',
          //     }
          // }

          const lawsikhoOrSkillerbitraPayload = {
            "email": paymentOrderDetils.customer_details.customer_email,
            "name": paymentOrderDetils.customer_details.customer_name,
            "country_id": existingDoc.payee.countryCode || 91,
            "phone": parseInt(paymentOrderDetils.customer_details.customer_phone),
            "brand_id": "2",
            "payment_system": 1,
            "data": [
              {
                "courseType": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                "Installment": existingDoc.price.paymentTypeId, //payment type
                "enrollmentType": "New enrollment",
                "date": paymentOrderDetils.created_at,
                "paymentMode": "Online",
                "feePaid": parseInt(paymentOrderDetils.order_amount), //ammout
                "totalFeesPaid": parseInt(paymentOrderDetils.order_amount), //ammout
                "paymentConfirmEmail": "N",
                "enrollmentId": existingDoc.courseInfo?.apId ? parseInt(existingDoc.courseInfo.apId) : null, //course id
                "enrollmentPlanId": existingDoc.coursePlanInfo?.id ? parseInt(existingDoc.coursePlanInfo?.id) : null, // plan id,
                "salesCallerId": existingDoc.paymentCollectedBy.refId,
                "modeOfPayment": 3,
                "salesPrice": existingDoc.price.salesPrice,
                "transaction_id": paymentOrderDetils.order_id,
                "entryType": 1,
                "brand_id": "2",
                "payment_system": 1,
                "payment_system_id": id
              }
            ]
          }

          console.log("lawsikhoOrSkillerbitraPayload:", lawsikhoOrSkillerbitraPayload)
          // send data to lawsikho or skillerbitra system
          const lawsikhoOrSkillerbitraResponse = await sendToLawsikhoOrSkillerbitra(lawsikhoOrSkillerbitraPayload, existingDoc, paymentOrderDetils)


          return res.status(200).json({
            message: "Change status to Paid successfully",
          });
        }





      } else {
        return res.status(500).json({
          message: "Failed to change status",
          response: response.error
        });
      }
    }


  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const approval_status = async (req, res) => {
  const userInfo =
    (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    req.headers.authorization;

  console.log("userInfo", userInfo);
  try {
    const id = req.params.id;
    const { approvalStatus, message } = req.body;
    console.log(id, req.body);

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === "not_found") {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    if (approvalStatus === "approved") {
      // existingDoc.currentStatus = ["generated"]
      existingDoc.approvalStatus = ["approved"];
      // existingDoc.statusChangeHistory.push({
      //     statusName: "generated",
      //     changeTime: new Date(),
      //     changedBy: {
      //         refId: userInfo.userInfo.user_id,
      //         name: userInfo.userInfo.name,
      //         email: userInfo.userInfo.email,
      //         phone: userInfo.userInfo.phone,
      //     }
      // })

      // if (existingDoc.paymentLinkExpireTime) {
      //     console.log(" have", existingDoc.paymentLinkExpireTime)

      //     // Set token expiration based on paymentLinkExpireTime
      //     const expirationTimeInSeconds = Math.floor((new Date(existingDoc.paymentLinkExpireTime) - new Date()) / 1000);

      //     const tokenPayload = {
      //         channel: existingDoc.channelInfo || {},
      //         lead: existingDoc.lead || {},
      //         courseType: existingDoc.courseType || "",
      //         courseInfo: existingDoc.courseInfo || {},
      //         coursePlanInfo: existingDoc.coursePlanInfo || {},
      //         price: existingDoc.price || {},
      //         currentStatus: existingDoc.currentStatus || [""],
      //         selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
      //         pageContent: existingDoc.pageContent || "",
      //         paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
      //         id: existingDoc._id
      //     };

      //     console.log(expirationTimeInSeconds)
      //     const newToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

      //     // Update the document with the new token
      //     existingDoc.token = newToken;

      //     if (existingDoc.channelInfo?.name) {
      //         if (existingDoc.channelInfo.name == 'Skillarbitra') {
      //             existingDoc.paymentLink = `https://payment-collect2.lawsikho.dev/payment?token=${newToken}`
      //         }
      //         if (existingDoc.channelInfo.name == 'Lawsikho') {
      //             existingDoc.paymentLink = `https://payment-collect1.lawsikho.dev/payment?token=${newToken}`
      //         }
      //     }

      //     // Save the updated document back to the database
      //     const response = await DB.insert(existingDoc);

      //     if (response.ok) {
      //         return res.status(200).json({
      //             message: "Payment Link updated successfully",
      //             response,
      //             token: newToken
      //         });
      //     } else {
      //         return res.status(500).json({
      //             message: "Some Internal error occur",
      //             response: response.error
      //         });
      //     }
      // }

      // if (!existingDoc.paymentLinkExpireTime) {
      //     console.log("dont have", existingDoc.paymentLinkExpireTime)

      //     const tokenPayload = {
      //         channel: existingDoc.channelInfo || {},
      //         lead: existingDoc.lead || {},
      //         courseType: existingDoc.courseType || "",
      //         courseInfo: existingDoc.courseInfo || {},
      //         coursePlanInfo: existingDoc.coursePlanInfo || {},
      //         price: existingDoc.price || {},
      //         currentStatus: existingDoc.currentStatus || [""],
      //         selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
      //         pageContent: existingDoc.pageContent || "",
      //         paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
      //         id: existingDoc.id
      //     };

      //     const newToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

      //     // Update the document with the new token
      //     existingDoc.token = newToken;

      //     if (existingDoc.channelInfo?.name) {
      //         if (existingDoc.channelInfo.name == 'Skillarbitra') {
      //             existingDoc.paymentLink = `https://payment-collect2.lawsikho.dev/payment?token=${newToken}`
      //         }
      //         if (existingDoc.channelInfo.name == 'Lawsikho') {
      //             existingDoc.paymentLink = `https://payment-collect1.lawsikho.dev/payment?token=${newToken}`
      //         }
      //     }

      //     // Save the updated document back to the database
      //     const response = await DB.insert(existingDoc);

      //     if (response.ok) {
      //         res.status(200).json({
      //             message: "Payment Link updated successfully",
      //             response,
      //             token: newToken
      //         });
      //     } else {
      //         res.status(500).json({
      //             message: "Some Internal error occur",
      //             response: response.error
      //         });
      //     }
      // }


      if (approvalStatus === "rejected") {
        existingDoc.currentStatus = ["cancelled"];
        existingDoc.approvalStatus = ["rejected"];

        // existingDoc.statusChangeHistory.push({
        //     statusName: "cancelled",
        //     changeTime: new Date(),
        //     changedBy: {
        //         refId: userInfo.userInfo?.user_id,
        //         name: userInfo.userInfo?.name,
        //         email: userInfo.userInfo?.email,
        //         // phone: userInfo.userInfo?.phone,
        //         phone: {
        //             countryCode: userInfo.userInfo?.countryCode || 91,
        //             phoneNo: userInfo.userInfo?.phone || null,
        //             contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        //         }
        //     },
        // });
      }

      // Update the field in the payload
      existingDoc.approvalStatus = approvalStatus;
      existingDoc.approvalStatusChangeHistory =
        existingDoc.approvalStatusChangeHistory || [];
      // Create a new object for approvalStatusChangeHistory
      const approvalStatusChange = {
        statusName: approvalStatus,
        changeTime: new Date(),
        changedBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo?.email,
          // phone: userInfo.userInfo.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone || null,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
          }
        },
        message: {
          code: null,
          text: message,
        },
      };

      // Push the new object into the approvalStatusChangeHistory array
      existingDoc.approvalStatusChangeHistory.push(approvalStatusChange);
      existingDoc.statusChangeHistory.push(approvalStatusChange);

      console.log("existing docs updated", existingDoc);

      // Save the updated document back to the database
      const response = await DB.insert(existingDoc);

      let modifiedUserHTML;

      let fromEmail;

      let newapiKey;
      let newdomain;

      if (existingDoc.channelInfo.lsSaRefId == "1") {
        (newapiKey = process.env.LAWSIKHO_KEY),
          (newdomain = process.env.LAWSIKHO_DOMAIN),
          (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
        modifiedUserHTML = rejectemailtemplate.replace(
          /{name}/g,
          existingDoc.lead.name
        );
        modifiedUserHTML = modifiedUserHTML.replace(
          /{logoImage}/g,
          "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
        );
      } else if (existingDoc.channelInfo.lsSaRefId == "2") {
        (newapiKey = process.env.SKILLARBITRAGE_KEY),
          (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
          (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
        modifiedUserHTML = skillRejectEmail.replace(
          /{name}/g,
          existingDoc.lead.name
        );
        modifiedUserHTML = modifiedUserHTML.replace(
          /{logoImage}/g,
          "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
        );
      } else {
        (newapiKey = process.env.LAWSIKHO_KEY),
          (newdomain = process.env.LAWSIKHO_DOMAIN),
          (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
        modifiedUserHTML = rejectemailtemplate.replace(
          /{name}/g,
          existingDoc.lead.name
        );
        modifiedUserHTML = modifiedUserHTML.replace(
          /{logoImage}/g,
          "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
        );
      }

      modifiedUserHTML = modifiedUserHTML.replace(
        /{amount}/g,
        existingDoc.price.paymentToBeCollected
      );

      let mg;
      if (existingDoc.channelInfo.lsSaRefId == "1") {
        mg = mailgun({
          apiKey: newapiKey,
          domain: newdomain,
        });
      } else {
        mg = mailgun({
          apiKey: newapiKey,
          domain: newdomain,
          host: process.env.SKILLARBITRA_HOST,
        });
      }

      if (response.ok) {
        res.status(200).json({
          message: "Approvel status changed successfully",
          response,
        });
        // Send email using ZeptoMail if approvalStatus is "rejected"
        if (approvalStatus === "rejected") {
          // Create a ZeptoMail client
          const zeptoMailClient = new SendMailClient({ url, token });

          // Define email content for rejection
          const rejectionEmailContent = {
            from: fromEmail,
            to: existingDoc.lead.email,
            subject: "Notification of payment link cancellation",
            text: "Your PaymentLink has been cancellation",
            html: modifiedUserHTML,
          };

          const rejectionEmailCreatedBy = {
            from: fromEmail,
            to: userInfo.userInfo.email,
            subject: "PaymentLink Rejection Notification",
            text: "Your PaymentLink has been rejected.",
            html: modifiedUserHTML,
          };

          // Send rejection email
          const data = await mg.messages().send(rejectionEmailContent);
          console.log(data, "Rejection email sent successfully");

          const dataa = await mg.messages().send(rejectionEmailCreatedBy);
          console.log(dataa, "Rejection email sent successfully to createdby");
        }
      } else {
        return res.status(500).json({
          message: "Failed to change approval status",
          response: response.error,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateCurrentStatusInExistingDocs = async (id, userInfo) => {
  let existingDoc;
  try {
    existingDoc = await DB.get(id);
  } catch (error) {
    if (error.statusCode === 404 && error.error === 'not_found') {
      res.status(404).json({
        message: "PaymentLink not found",
      });
      return;
    } else {
      throw error; // rethrow other errors
    }
  }

  existingDoc.currentStatus = ["deleted"]
  existingDoc.statusChangeHistory?.push({
    statusName: "deleted",
    changeTime: new Date(),
    changedBy: {
      refId: userInfo.userInfo?.user_id,
      name: userInfo.userInfo?.name,
      email: userInfo.userInfo?.email,
      // phone: userInfo.userInfo.phone,
      phone: {
        countryCode: userInfo.userInfo?.countryCode || 91,
        phoneNo: userInfo.userInfo?.phone || null,
        contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
      }
    }
  })

  const response = await DB.insert(existingDoc);
}
// this function is used to update the payment link
const regenerate_payment_link = async (req, res) => {
  const userInfo =
    (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    req.headers.authorization;

  console.log("userInfo", userInfo)
  try {
    // this is the documentId of the payment link
    const id = req.params.id;
    const payload = req.body;
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === 'not_found') {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    // if (req.body.lead) existingDoc.lead = req.body.lead;
    if (payload.lead?.phone?.countryCode) {
      console.log("IN")
      existingDoc.lead.phone.countryCode = payload.lead?.phone?.countryCode
      existingDoc.lead.phone.contactedNumber = `+${payload.lead?.phone?.countryCode}${existingDoc.lead?.phone?.phoneNo}`

    }

    if (payload.lead?.phone?.phoneNo) {
      // existingDoc.lead.phone.phoneNo = payload.lead.phone.phoneNo
      // existingDoc.lead.phone.contactedNumber = `+${existingDoc.lead.phone.countryCode}${payload.lead.phone.phoneNo}`
      const emailSchema = Joi.number().required().allow('').allow(null);
      const { error } = emailSchema.validate(payload.lead?.phone?.phoneNo);

      if (error) {
        // Handle validation error, e.g., log the error or return a response
        // console.error('Email validation error:', error.details[0].message);

        return res.status(400).json({
          message: "phone must be a valid number",
        });
        // Handle the error according to your requirements
      } else {
        existingDoc.lead.phone.phoneNo = payload.lead.phone.phoneNo
        existingDoc.lead.phone.contactedNumber = `+${existingDoc.lead.phone.countryCode}${payload.lead.phone.phoneNo}`
      }
    }

    if (payload.lead?.phone?.countryCode && payload.lead?.phone?.phoneNo) {
      existingDoc.lead.phone.countryCode = payload.lead.phone.countryCode
      existingDoc.lead.phone.phoneNo = payload.lead.phone.phoneNo
      existingDoc.lead.phone.contactedNumber = `+${payload.lead.phone.countryCode}${payload.lead.phone.phoneNo}`
    }

    if (payload.lead?.phone?.countryName) {
      existingDoc.lead.phone.countryName = payload.lead.phone.countryName
    }

    if (payload.lead?.name) {
      existingDoc.lead.name = payload.lead.name
    }
    if (payload.lead?.email) {
      // existingDoc.lead.email = payload.lead.email
      const emailSchema = Joi.string().email();
      const { error } = emailSchema.validate(payload.lead.email);

      if (error) {
        // Handle validation error, e.g., log the error or return a response
        // console.error('Email validation error:', error.details[0].message);

        return res.status(400).json({
          message: "Email must be a valid email",
        });
        // Handle the error according to your requirements
      } else {
        existingDoc.lead.email = payload.lead.email;
      }

    }


    if (payload.price.originalPrice) {
      const emailSchema = Joi.number().required();
      const { error } = emailSchema.validate(payload.price.originalPrice);

      if (error) {
        // Handle validation error, e.g., log the error or return a response
        // console.error('Email validation error:', error.details[0].message);

        return res.status(400).json({
          message: "OriginalPrice must be a valid number",
        });
        // Handle the error according to your requirements
      }
    }
    if (payload.price.salesPrice) {
      const emailSchema = Joi.number().required();
      const { error } = emailSchema.validate(payload.price.salesPrice);

      if (error) {
        // Handle validation error, e.g., log the error or return a response
        // console.error('Email validation error:', error.details[0].message);

        return res.status(400).json({
          message: "SalesPrice must be a valid number",
        });
        // Handle the error according to your requirements
      }
    }
    if (payload.price.paymentToBeCollected) {
      const emailSchema = Joi.number().required();
      const { error } = emailSchema.validate(payload.price.paymentToBeCollected);

      if (error) {
        // Handle validation error, e.g., log the error or return a response
        // console.error('Email validation error:', error.details[0].message);

        return res.status(400).json({
          message: "PaymentToBeCollected must be a valid number",
        });
        // Handle the error according to your requirements
      }
    }

    if (req.body.payee) existingDoc.payee = req.body.payee;
    if (req.body.channelInfo) existingDoc.channelInfo = req.body.channelInfo;
    if (req.body.courseType) existingDoc.courseType = req.body.courseType;
    if (req.body.courseInfo) existingDoc.courseInfo = req.body.courseInfo;
    if (req.body.coursePlanInfo) existingDoc.coursePlanInfo = req.body.coursePlanInfo;
    if (req.body.price) existingDoc.price = req.body.price;
    if (req.body.paymentCollectedBy) existingDoc.paymentCollectedBy = req.body.paymentCollectedBy;
    if (req.body.linkGeneratedBy) existingDoc.linkGeneratedBy = req.body.linkGeneratedBy;
    if (req.body.selectedPaymentGateways) existingDoc.selectedPaymentGateways = req.body.selectedPaymentGateways;

    if (req.body.paymentCapturedInfo) existingDoc.paymentCapturedInfo = req.body.paymentCapturedInfo;
    // if (req.body.paymentLink) existingDoc.paymentLink = req.body.paymentLink;
    if (req.body.paymentLinkGeneratedTime) existingDoc.paymentLinkGeneratedTime = req.body.paymentLinkGeneratedTime;

    if (req.body.paymentLinkExpireTime) existingDoc.paymentLinkExpireTime = req.body.paymentLinkExpireTime;
    if (req.body.paymentCaptureTime) existingDoc.paymentCaptureTime = req.body.paymentCaptureTime;
    if (req.body.currentStatus) existingDoc.currentStatus = req.body.currentStatus;

    if (req.body.statusChangeHistory) existingDoc.statusChangeHistory = req.body.statusChangeHistory;
    if (req.body.approvalStatus) existingDoc.approvalStatus = req.body.approvalStatus;
    if (req.body.pageContent) existingDoc.pageContent = req.body.pageContent;


    if (req.body.price?.originalPrice === req.body.price?.salesPrice) {
      existingDoc.approvalStatus = "approved"

      if (existingDoc.paymentLinkExpireTime) {
        console.log(" have", existingDoc.paymentLinkExpireTime)

        // Set token expiration based on paymentLinkExpireTime
        const expirationTimeInSeconds = Math.floor((new Date(existingDoc.paymentLinkExpireTime) - new Date()) / 1000);

        const tokenPayload = {
          channel: existingDoc.channelInfo || {},
          lead: existingDoc.lead || {},
          courseType: existingDoc.courseType || "",
          courseInfo: existingDoc.courseInfo || {},
          coursePlanInfo: existingDoc.coursePlanInfo || {},
          price: existingDoc.price || {},
          currentStatus: existingDoc.currentStatus || [""],
          selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
          pageContent: existingDoc.pageContent || "",
          paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
          id: existingDoc.id
        };

        console.log(expirationTimeInSeconds)
        const newToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

        // Update the document with the new token
        existingDoc.token = newToken;

        if (existingDoc.channelInfo?.name) {
          if (existingDoc.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${newToken}`
          }
          if (existingDoc.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${newToken}`
          }
        }




        const changeStatusResponse = await updateCurrentStatusInExistingDocs(id, userInfo);
        // existingDoc.currentStatus = ["deleted"]
        // existingDoc.statusChangeHistory?.push({
        //   statusName: "deleted",
        //   changeTime: new Date(),
        //   changedBy: {
        //     refId: userInfo.userInfo?.user_id,
        //     name: userInfo.userInfo?.name,
        //     email: userInfo.userInfo?.email,
        //     // phone: userInfo.userInfo.phone,
        //     phone: {
        //       countryCode: userInfo.userInfo?.countryCode || 91,
        //       phoneNo: userInfo.userInfo?.phone || null,
        //       contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        //     }
        //   }
        // })

        existingDoc.currentStatus = ["generated"]
        existingDoc.statusChangeHistory?.push({
          statusName: "generated",
          changeTime: new Date(),
          changedBy: {
            refId: userInfo.userInfo?.user_id,
            name: userInfo.userInfo?.name,
            email: userInfo.userInfo?.email,
            // phone: userInfo.userInfo.phone,
            phone: {
              countryCode: userInfo.userInfo?.countryCode || 91,
              phoneNo: userInfo.userInfo?.phone || null,
              contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
            },

            otherInfo: {
              previousPaymentLinkId: id
            }
          }
        })
        delete existingDoc._id;
        const response = await DB.insert(existingDoc);

        if (response.ok) {
          res.status(200).json({
            message: "Payment Link updated successfully",
            response,
            token: newToken
          });
        } else {
          res.status(500).json({
            message: "Some Internal error occur",
            response: response.error
          });
        }
      }


      if (!existingDoc.paymentLinkExpireTime) {
        console.log("dont have", existingDoc.paymentLinkExpireTime)

        const tokenPayload = {
          channel: existingDoc.channelInfo || {},
          lead: existingDoc.lead || {},
          courseType: existingDoc.courseType || "",
          courseInfo: existingDoc.courseInfo || {},
          coursePlanInfo: existingDoc.coursePlanInfo || {},
          price: existingDoc.price || {},
          currentStatus: existingDoc.currentStatus || [""],
          selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
          pageContent: existingDoc.pageContent || "",
          paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
          id: existingDoc.id
        };

        const newToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

        // Update the document with the new token
        existingDoc.token = newToken;

        if (existingDoc.channelInfo?.name) {
          if (existingDoc.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${newToken}`
          }
          if (existingDoc.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${newToken}`
          }
        }


        const changeStatusResponse = await updateCurrentStatusInExistingDocs(id, userInfo);
        // existingDoc.currentStatus = ["deleted"]
        // existingDoc.statusChangeHistory?.push({
        //   statusName: "deleted",
        //   changeTime: new Date(),
        //   changedBy: {
        //     refId: userInfo.userInfo?.user_id,
        //     name: userInfo.userInfo?.name,
        //     email: userInfo.userInfo?.email,
        //     // phone: userInfo.userInfo.phone,
        //     phone: {
        //       countryCode: userInfo.userInfo?.countryCode || 91,
        //       phoneNo: userInfo.userInfo?.phone || null,
        //       contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        //     }
        //   }
        // })

        existingDoc.currentStatus = ["generated"]
        existingDoc.statusChangeHistory?.push({
          statusName: "generated",
          changeTime: new Date(),
          changedBy: {
            refId: userInfo.userInfo?.user_id,
            name: userInfo.userInfo?.name,
            email: userInfo.userInfo?.email,
            // phone: userInfo.userInfo.phone,
            phone: {
              countryCode: userInfo.userInfo?.countryCode || 91,
              phoneNo: userInfo.userInfo?.phone || null,
              contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
            },
            otherInfo: {
              previousPaymentLinkId: id
            }
          }
        })
        delete existingDoc._id;
        const response = await DB.insert(existingDoc);

        if (response.ok) {
          res.status(200).json({
            message: "Payment Link updated successfully",
            response,
            token: newToken
          });
        } else {
          res.status(500).json({
            message: "Some Internal error occur",
            response: response.error
          });
        }
      }

    } else {
      existingDoc.approvalStatus = "pending"
      existingDoc.currentStatus = ["generated"]
      existingDoc.statusChangeHistory?.push({
        statusName: "generated",
        changeTime: new Date(),
        changedBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo?.email,
          // phone: userInfo.userInfo.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone || null,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
          }
        }
      })

      if (existingDoc.paymentLinkExpireTime) {
        console.log(" have", existingDoc.paymentLinkExpireTime)

        // Set token expiration based on paymentLinkExpireTime
        const expirationTimeInSeconds = Math.floor((new Date(existingDoc.paymentLinkExpireTime) - new Date()) / 1000);

        const tokenPayload = {
          channel: existingDoc.channelInfo || {},
          lead: existingDoc.lead || {},
          courseType: existingDoc.courseType || "",
          courseInfo: existingDoc.courseInfo || {},
          coursePlanInfo: existingDoc.coursePlanInfo || {},
          price: existingDoc.price || {},
          currentStatus: existingDoc.currentStatus || [""],
          selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
          pageContent: existingDoc.pageContent || "",
          paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
          id: existingDoc.id
        };

        console.log(expirationTimeInSeconds)
        const newToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, { expiresIn: expirationTimeInSeconds });

        // Update the document with the new token
        existingDoc.token = newToken;

        if (existingDoc.channelInfo?.name) {
          if (existingDoc.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${newToken}`
          }
          if (existingDoc.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${newToken}`
          }
        }


        const changeStatusResponse = await updateCurrentStatusInExistingDocs(id, userInfo);
        // existingDoc.currentStatus = ["deleted"]
        // existingDoc.statusChangeHistory?.push({
        //   statusName: "deleted",
        //   changeTime: new Date(),
        //   changedBy: {
        //     refId: userInfo.userInfo?.user_id,
        //     name: userInfo.userInfo?.name,
        //     email: userInfo.userInfo?.email,
        //     // phone: userInfo.userInfo.phone,
        //     phone: {
        //       countryCode: userInfo.userInfo?.countryCode || 91,
        //       phoneNo: userInfo.userInfo?.phone || null,
        //       contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        //     }
        //   }
        // })

        existingDoc.currentStatus = ["generated"]
        existingDoc.statusChangeHistory?.push({
          statusName: "generated",
          changeTime: new Date(),
          changedBy: {
            refId: userInfo.userInfo?.user_id,
            name: userInfo.userInfo?.name,
            email: userInfo.userInfo?.email,
            // phone: userInfo.userInfo.phone,
            phone: {
              countryCode: userInfo.userInfo?.countryCode || 91,
              phoneNo: userInfo.userInfo?.phone || null,
              contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
            },
            otherInfo: {
              previousPaymentLinkId: id
            }
          }
        })
        delete existingDoc._id;
        const response = await DB.insert(existingDoc);

        if (response.ok) {
          res.status(200).json({
            message: "Payment Link updated successfully",
            response,
            token: newToken
          });
        } else {
          res.status(500).json({
            message: "Some Internal error occur",
            response: response.error
          });
        }
      }


      if (!existingDoc.paymentLinkExpireTime) {
        console.log("dont have", existingDoc.paymentLinkExpireTime)

        const tokenPayload = {
          channel: existingDoc.channelInfo || {},
          lead: existingDoc.lead || {},
          courseType: existingDoc.courseType || "",
          courseInfo: existingDoc.courseInfo || {},
          coursePlanInfo: existingDoc.coursePlanInfo || {},
          price: existingDoc.price || {},
          currentStatus: existingDoc.currentStatus || [""],
          selectedPaymentGateways: existingDoc.selectedPaymentGateways || [],
          pageContent: existingDoc.pageContent || "",
          paymentLinkExpireTime: existingDoc.paymentLinkExpireTime,
          id: existingDoc.id
        };

        const newToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

        // Update the document with the new token
        existingDoc.token = newToken;

        if (payload.channelInfo?.name) {
          if (payload.channelInfo.name == 'Skillarbitra') {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${newToken}`
          }
          if (payload.channelInfo.name == 'Lawsikho') {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${newToken}`
          }
        }


        const changeStatusResponse = await updateCurrentStatusInExistingDocs(id, userInfo);
        // existingDoc.currentStatus = ["deleted"]
        // existingDoc.statusChangeHistory?.push({
        //   statusName: "deleted",
        //   changeTime: new Date(),
        //   changedBy: {
        //     refId: userInfo.userInfo?.user_id,
        //     name: userInfo.userInfo?.name,
        //     email: userInfo.userInfo?.email,
        //     // phone: userInfo.userInfo.phone,
        //     phone: {
        //       countryCode: userInfo.userInfo?.countryCode || 91,
        //       phoneNo: userInfo.userInfo?.phone || null,
        //       contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        //     }
        //   }
        // })

        existingDoc.currentStatus = ["generated"]
        existingDoc.statusChangeHistory?.push({
          statusName: "generated",
          changeTime: new Date(),
          changedBy: {
            refId: userInfo.userInfo?.user_id,
            name: userInfo.userInfo?.name,
            email: userInfo.userInfo?.email,
            // phone: userInfo.userInfo.phone,
            phone: {
              countryCode: userInfo.userInfo?.countryCode || 91,
              phoneNo: userInfo.userInfo?.phone || null,
              contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
            },
            otherInfo: {
              previousPaymentLinkId: id
            }
          }
        })
        delete existingDoc._id;
        const response = await DB.insert(existingDoc);

        if (response.ok) {
          res.status(200).json({
            message: "Payment Link updated successfully",
            response,
            token: newToken
          });
        } else {
          res.status(500).json({
            message: "Some Internal error occur",
            response: response.error
          });
        }
      }

    }



  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const get_all_payment_link = async (req, res) => {
  try {
    // Extracting query parameters
    var {
      paymentLinkGeneratedStartDate,
      paymentLinkGeneratedEndDate,
      paymentCaptureTimeStartDate,
      paymentCaptureTimeEndDate,
      paymentLink,
      approvalStatus,
      channel,
      paymentType,
      course,
      offer,
      courseType,
      page,
      pageSize,
      search,
      status,
      showFor,
      paymentGateway,
    } = req.query;

    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    console.log("userInfo:", userInfo);


    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10;
    console.log(page);

    // Building the query object
    const selector = {
      collectionName: "PaymentLink", // Adding the collectionName filter
      currentStatus: { $ne: ["deleted"] },
    };
    // Building the query object

    const sort = [{ paymentLinkGeneratedTime: "desc" }];

    // Define the index for paymentLinkGeneratedTime
    const index = {
      index: {
        fields: ["paymentLinkGeneratedTime"],
      },
      ddoc: "paymentLinkGeneratedTime-index", // You can choose a name for the index
    };

    // Create the index
    await DB.createIndex(index);

    // Adding filters based on query parameters
    if (paymentLinkGeneratedStartDate && paymentLinkGeneratedEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentLinkGeneratedEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentLinkGeneratedTime = {
        $gte: new Date(paymentLinkGeneratedStartDate),
        $lte: endDate,
      };
    }

    if (paymentCaptureTimeStartDate && paymentCaptureTimeEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentCaptureTimeEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentCaptureTime = {
        $gte: new Date(paymentCaptureTimeStartDate),
        $lte: endDate,
      };
    }

    if (paymentLink) {
      // Not using $regex directly here due to CouchDB limitations
      selector["paymentLink"] = paymentLink.toLowerCase();
    }

    if (approvalStatus) {
      selector.approvalStatus = approvalStatus;
    }

    if (userInfo?.userInfo?.role?.toLowerCase() != "admin" && userInfo?.userInfo?.role?.toLowerCase() != "sales" && userInfo?.userInfo?.role?.toLowerCase() != "sales+") {
      selector.$or = [
        { "linkGeneratedBy.email": userInfo?.userInfo?.email },
        { "paymentCollectedBy.email": userInfo?.userInfo?.email },
      ];
    }

    if (status) {
      // If approvalStatus is an enum, convert it to an array
      if (status == "expired") {
        (selector.currentStatus = { $nin: ["paid", "cancelled", "deleted", "processing"] }),
          (selector.paymentLinkExpireTime = { $lt: new Date(), $ne: null });
      } else if (status == "edited") {
        selector.dataModified = true;
      } else {
        selector.currentStatus = Array.isArray(status) ? status : [status];
      }
    }

    if (showFor) {
      console.log('showFor', showFor)
      let showForArray = showFor.split(",").map(value => String(value));
      console.log('showForArray', showForArray)
      selector["paymentCollectedBy.refId"] = {
        $in: showForArray,
      };
    }

    if (paymentType) {
      console.log('showFor', paymentType)
      let paymentArray = paymentType.split(",").map(value => String(value).toLowerCase());
      console.log('paymentArray', paymentArray)
      selector["price.paymentType"] = {
        $in: paymentArray,
      };
    }

    if (course) {
      // Not using $regex directly here due to CouchDB limitations

      console.log('course', course)
      let courseArray = course.split(",").map(value => String(value));

      console.log('courseArray', courseArray)

      selector["courseInfo.lsSaId"] = {
        $in: courseArray,
      };
      selector["courseType"] = "standalone";
    }

    if (offer) {
      // Not using $regex directly here due to CouchDB limitations

      console.log('offer', offer)
      let offerArray = offer.split(",").map(value => String(value));
      console.log('offerArray', offerArray)

      selector["courseInfo.lsSaId"] = {
        $in: offerArray,
      };
      selector["courseType"] = "bootcamp";
    }

    if (channel) {
      console.log(channel);

      selector["channelInfo.lsSaRefId"] = channel;
    }

    if (courseType) {
      selector["courseType"] = courseType.toLowerCase();
    }

    // Additional filter for payment gateway
    if (paymentGateway) {
      selector["paymentCapturedInfo.gatewayName"] = paymentGateway;
    }

    console.log("selector", selector);

    if (search) {
      const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const searchRegex = `(?i)${escapedSearch}`; // Case-insensitive regex

      selector.$or = [
        { "lead.name": { $regex: searchRegex } },
        { "lead.email": { $regex: searchRegex } },
        { "lead.phone.contactedNumber": { $regex: searchRegex } },
        { paymentLink: { $regex: searchRegex } },
        { "channelInfo.name": { $regex: searchRegex } },
        { courseType: { $regex: searchRegex } },
        { "courseInfo.label": { $regex: searchRegex } },
        { "coursePlanInfo.name": { $regex: searchRegex } },
        { "coursePlanInfo.original_price": { $regex: searchRegex } },
        { "price.paymentType": { $regex: searchRegex } },
        { "price.salesPrice": { $regex: searchRegex } },
        { "price.paymentToBeCollected": { $regex: searchRegex } },
        { "paymentCollectedBy.name": { $regex: searchRegex } },
        { "linkGeneratedBy.name": { $regex: searchRegex } },
        { "paymentCapturedInfo.gatewayName": { $regex: searchRegex } },
        { selectedPaymentGateways: { $in: [search] } },
        { paymentLinkExpireTime: { $regex: searchRegex } },
        { paymentLinkGeneratedTime: { $regex: searchRegex } },
        { pageContent: { $regex: searchRegex } },
        {
          currentStatus: {
            $elemMatch: { $regex: searchRegex },
          },
        },
        { "payee.name": { $regex: searchRegex } },
        { "payee.email": { $regex: searchRegex } },
        { "payee.phone.contactedNumber": { $regex: searchRegex } },
      ];
    }

    const totDocsResponse = await DB.list({
      include_docs: true,
      limit: 0, // Set limit to 0 to get only metadata without documents
    });


    // Creating a new object without the currentStatus key
    const newSelector = { ...selector };
    delete newSelector.currentStatus;

    // Output the new selector object
    console.log("newSelector", newSelector);




    const offset = (page - 1) * pageSize;

    const result = await DB.find({
      selector,
      limit: parseInt(pageSize),
      skip: parseInt(offset),
      sort: [{ paymentLinkGeneratedTime: "desc" }],
    });
    console.log(result.docs.length);

    console.log("All Docs Response:", totDocsResponse.total_rows);


    // if (selector.approvalStatus) delete selector.approvalStatus;

    const totDocs = await DB.find({
      selector,
      fields: ["_id"],
      limit: totDocsResponse.total_rows,
    });


    console.log("totDocs length:", totDocs.docs.length)





    const paginatedResult = result.docs;

    // this portion is written to append the short url
    const paginatedResultWithShortUrl = paginatedResult.map((item) => {
      if (
        item.hasOwnProperty("paymentLink") &&
        item.paymentLink &&
        item.paymentLink.split("=").length > 0
      ) {
        let paymentLink = `${item.paymentLink.split("=")[0]}=${item._id}`;
        item.paymentLink = paymentLink;
        return item;
      } else {
        return item;
      }
    });

    // Reverse statusChangeHistory array
    await paginatedResultWithShortUrl?.forEach((doc) => {
      if (doc) {
        //console.log("doc", doc);
        if (doc.statusChangeHistory) {
          doc.statusChangeHistory.reverse();
        }
        if (doc.approvalStatusChangeHistory) {
          doc.approvalStatusChangeHistory.reverse();
        }
      }
    });

    const response = {
      docs: paginatedResultWithShortUrl,
      limit: parseInt(pageSize),
      totalDocs: totDocs.docs.length, // Total count after sorting
      page: parseInt(page),
      totalPages: Math.ceil(totDocs.docs.length / pageSize),
      success: true
    };
    res.json(response);
  } catch (error) {
    // Handling errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error " });
  }
};


const get_all_report_for_payment_link = async (req, res) => {
  try {
    // Extracting query parameters
    var {
      paymentLinkGeneratedStartDate,
      paymentLinkGeneratedEndDate,
      paymentCaptureTimeStartDate,
      paymentCaptureTimeEndDate,
      paymentLink,
      approvalStatus,
      channel,
      paymentType,
      course,
      offer,
      courseType,
      search,
      status,
      showFor,
      paymentGateway,
    } = req.query;

    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    console.log("userInfo:", userInfo);

    let totalPaidCount = 0;
    let totalSharedCount = 0;
    let totalExpiredCount = 0;



    // Building the query object
    const selector = {
      collectionName: "PaymentLink", // Adding the collectionName filter
      currentStatus: { $ne: ["deleted"] },
    };
    // Building the query object


    // Define the index for paymentLinkGeneratedTime
    const index = {
      index: {
        fields: ["paymentLinkGeneratedTime"],
      },
      ddoc: "paymentLinkGeneratedTime-index", // You can choose a name for the index
    };

    // Create the index
    await DB.createIndex(index);

    // Adding filters based on query parameters
    if (paymentLinkGeneratedStartDate && paymentLinkGeneratedEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentLinkGeneratedEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentLinkGeneratedTime = {
        $gte: new Date(paymentLinkGeneratedStartDate),
        $lte: endDate,
      };
    }

    if (paymentCaptureTimeStartDate && paymentCaptureTimeEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentCaptureTimeEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentCaptureTime = {
        $gte: new Date(paymentCaptureTimeStartDate),
        $lte: endDate,
      };
    }

    if (paymentLink) {
      // Not using $regex directly here due to CouchDB limitations
      selector["paymentLink"] = paymentLink.toLowerCase();
    }



    if (userInfo?.userInfo?.role?.toLowerCase() != "admin" && userInfo?.userInfo?.role?.toLowerCase() != "sales" && userInfo?.userInfo?.role?.toLowerCase() != "sales+") {
      selector.$or = [
        { "linkGeneratedBy.email": userInfo?.userInfo?.email },
        { "paymentCollectedBy.email": userInfo?.userInfo?.email },
      ];
    }

    if (status) {
      // If approvalStatus is an enum, convert it to an array
      if (status == "expired") {
        (selector.currentStatus = { $nin: ["paid", "cancelled", "deleted", "processing"] }),
          (selector.paymentLinkExpireTime = { $lt: new Date(), $ne: null });
      } else if (status == "edited") {
        selector.dataModified = true;
      } else {
        selector.currentStatus = Array.isArray(status) ? status : [status];
      }
    }

    if (showFor) {
      console.log('showFor', showFor)
      let showForArray = showFor.split(",").map(value => String(value));
      console.log('showForArray', showForArray)
      selector["paymentCollectedBy.refId"] = {
        $in: showForArray,
      };
    }

    if (paymentType) {
      console.log('showFor', paymentType)
      let paymentArray = paymentType.split(",").map(value => String(value).toLowerCase());
      console.log('paymentArray', paymentArray)
      selector["price.paymentType"] = {
        $in: paymentArray,
      };
    }

    if (course) {
      // Not using $regex directly here due to CouchDB limitations

      console.log('course', course)
      let courseArray = course.split(",").map(value => String(value));

      console.log('courseArray', courseArray)

      selector["courseInfo.lsSaId"] = {
        $in: courseArray,
      };
      selector["courseType"] = "standalone";
    }

    if (offer) {
      // Not using $regex directly here due to CouchDB limitations

      console.log('offer', offer)
      let offerArray = offer.split(",").map(value => String(value));
      console.log('offerArray', offerArray)

      selector["courseInfo.lsSaId"] = {
        $in: offerArray,
      };
      selector["courseType"] = "bootcamp";
    }

    if (channel) {
      console.log(channel);

      selector["channelInfo.lsSaRefId"] = channel;
    }

    if (courseType) {
      selector["courseType"] = courseType.toLowerCase();
    }

    // Additional filter for payment gateway
    if (paymentGateway) {
      selector["paymentCapturedInfo.gatewayName"] = paymentGateway;
    }

    console.log(selector);

    if (search) {
      const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const searchRegex = `(?i)${escapedSearch}`; // Case-insensitive regex

      selector.$or = [
        { "lead.name": { $regex: searchRegex } },
        { "lead.email": { $regex: searchRegex } },
        { "lead.phone.contactedNumber": { $regex: searchRegex } },
        { paymentLink: { $regex: searchRegex } },
        { "channelInfo.name": { $regex: searchRegex } },
        { courseType: { $regex: searchRegex } },
        { "courseInfo.label": { $regex: searchRegex } },
        { "coursePlanInfo.name": { $regex: searchRegex } },
        { "coursePlanInfo.original_price": { $regex: searchRegex } },
        { "price.paymentType": { $regex: searchRegex } },
        { "price.salesPrice": { $regex: searchRegex } },
        { "price.paymentToBeCollected": { $regex: searchRegex } },
        { "paymentCollectedBy.name": { $regex: searchRegex } },
        { "linkGeneratedBy.name": { $regex: searchRegex } },
        { "paymentCapturedInfo.gatewayName": { $regex: searchRegex } },
        { selectedPaymentGateways: { $in: [search] } },
        { paymentLinkExpireTime: { $regex: searchRegex } },
        { paymentLinkGeneratedTime: { $regex: searchRegex } },
        { pageContent: { $regex: searchRegex } },
        {
          currentStatus: {
            $elemMatch: { $regex: searchRegex },
          },
        },
        { "payee.name": { $regex: searchRegex } },
        { "payee.email": { $regex: searchRegex } },
        { "payee.phone.contactedNumber": { $regex: searchRegex } },
      ];
    }

    // const totDocsResponse = await DB.list({
    //   include_docs: true,
    //   limit: 0, // Set limit to 0 to get only metadata without documents
    // });

    const totDocsResponse = {
      total_rows: 100000
    }

    const result = await DB.find({
      selector: selector,
      limit: totDocsResponse.total_rows,
      fields: ["currentStatus", "approvalStatus", "paymentLinkExpireTime", "_id"],
    });

    let paidCount1 = 0
    let expiredCount1 = 0
    let pendingCount1 = 0

    result.docs?.map((e, i) => {
      if (e?.currentStatus?.includes('paid')) paidCount1++
      if ((!e?.currentStatus?.includes('paid') && !e?.currentStatus?.includes('cancelled') && !e?.currentStatus?.includes('deleted')) && (e.paymentLinkExpireTime != null && new Date(e.paymentLinkExpireTime) < new Date())) expiredCount1++
      if (e?.approvalStatus == 'pending') pendingCount1++
    })

    let approvalCount = []

    if (approvalStatus) {
      selector.approvalStatus = approvalStatus;
      approvalCount = await DB.find({
        selector: selector,
        limit: totDocsResponse.total_rows,
        fields: ["_id"],
      });
    }

    // const response1 = {
    //   paidCount1, expiredCount1, pendingCount
    // };
    // res.json(response1);

    // Retrieve total counts for paid, shared, and expired
    // const paidCount = await DB.find({
    //   selector: {
    //     ...selector,
    //     statusChangeHistory: { $elemMatch: { statusName: "paid" } },
    //   },
    //   limit: totDocsResponse.total_rows,
    // });

    // const sharedCount = await DB.find({
    //   selector: {
    //     ...selector,
    //     $or: [
    //       { statusChangeHistory: { $elemMatch: { statusName: "shared" } } },
    //       { currentStatus: ["shared"] },
    //     ],
    //   },
    //   limit: totDocsResponse.total_rows,
    // });

    // Creating a new object without the currentStatus key
    // const newSelector = { ...selector };
    // delete newSelector.currentStatus;

    // // Output the new selector object
    // console.log("newSelector", newSelector);

    // const expiredCount = await DB.find({
    //   selector: {
    //     ...newSelector,
    //     currentStatus: { $nin: ["paid", "cancelled", "deleted"] },
    //     paymentLinkExpireTime: { $lt: new Date(), $ne: null },
    //   },
    //   limit: totDocsResponse.total_rows,
    // });
    // console.log("ff", selector);

    // if (approvalStatus == "pending") {
    //   totalPaidCount = 0;
    // } else {
    //   totalPaidCount = paidCount.docs.length;
    // }

    // totalSharedCount = sharedCount.docs.length;

    // if (status !== "paid") {
    //   totalExpiredCount = expiredCount.docs.length;
    // } else {
    //   totalExpiredCount = 0;
    // }


    // console.log("All Docs Response:", totDocsResponse.total_rows);

    // let pendingSelector = { ...selector };
    // pendingSelector.approvalStatus = "pending";
    // const pendingCount = await DB.find({
    //   selector: pendingSelector,
    //   limit: totDocsResponse.total_rows,
    // });

    //if (selector.approvalStatus) delete selector.approvalStatus;

    // const totDocs = await DB.find({
    //   selector,
    //   fields: ["_id"],
    //   limit: totDocsResponse.total_rows,
    // });

    // const pendingDocsDount = pendingCount.docs.length;

    // total counts of edit pending list of payment link

    const selector1 = {
      collectionName: "EditPaymentLink",
      status: { $ne: "Deleted" }, // Adding the collectionName filter
    };

    const editPendingPayment = await DB.find({
      selector: selector1,
      limit: totDocsResponse.total_rows,
      fields: ["_id", "paymentLinkId"],
    });



    let editPaymentCount = 0;

    // Iterate through each EditPaymentLink object
    for (const editPaymentLink of editPendingPayment.docs) {
      console.log("editPaymentLink", editPaymentLink);
      try {
        const resultWithMergedEdits = result.docs.map((doc) => {
          if (editPaymentLink.paymentLinkId === doc._id) {
            editPaymentCount = editPaymentCount + 1
          }
        });
      } catch (error) {
        console.error(`Error fetching payment link: ${error.message}`);
      }
    }




    const response = {
      totalDocs: approvalStatus ? approvalCount?.docs?.length : result.docs.length, // Total count after sorting
      success: true,
      pendingCount: approvalStatus ? approvalCount?.docs?.length : pendingCount1,
      paymentLinkCount: result.docs.length,
      totalPaidCount: paidCount1,
      totalExpiredCount: expiredCount1,
      editPendingPaymentLinkCount: editPaymentCount,
    };
    res.json(response);
  } catch (error) {
    // Handling errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error " });
  }
};



// const csv_of_payment_link = async (req, res) => {
//     try {
//         // Extracting query parameters
//         var {
//             paymentLinkGeneratedStartDate,
//             paymentLinkGeneratedEndDate,
//             paymentCaptureTimeStartDate,
//             paymentCaptureTimeEndDate,
//             paymentLink,
//             approvalStatus,
//             channel,
//             paymentType,
//             course,
//             courseType,
//             page,
//             pageSize,
//             search,
//             status,
//             showFor
//         } = req.query;

//         // // Ensure page and pageSize are required parameters
//         // if (!page || !pageSize) {
//         //     // return res.status(400).json({ error: 'page and pageSize are required parameters' });
//         //     page = 1
//         //     pageSize = 10
//         // }

//         page = page || 1
//         pageSize = pageSize || 10

//         // Building the query object
//         const selector = {
//             collectionName: 'PaymentLink' // Adding the collectionName filter
//         };

//         // Adding filters based on query parameters
//         if (paymentLinkGeneratedStartDate && paymentLinkGeneratedEndDate) {
//             // Adjusting the end date to include the entire day
//             const endDate = new Date(paymentLinkGeneratedEndDate);
//             endDate.setHours(23, 59, 59, 999);

//             selector.paymentLinkGeneratedTime = {
//                 $gte: new Date(paymentLinkGeneratedStartDate),
//                 $lte: endDate
//             };
//         }

//         if (paymentCaptureTimeStartDate && paymentCaptureTimeEndDate) {
//             // Adjusting the end date to include the entire day
//             const endDate = new Date(paymentCaptureTimeEndDate);
//             endDate.setHours(23, 59, 59, 999);

//             selector.paymentCaptureTime = {
//                 $gte: new Date(paymentCaptureTimeStartDate),
//                 $lte: endDate
//             };
//         }

//         if (paymentLink) {
//             // Not using $regex directly here due to CouchDB limitations
//             selector['paymentLink'] = paymentLink.toLowerCase();
//         }

//         if (approvalStatus) {
//             // If approvalStatus is an enum, convert it to an array
//             selector.approvalStatus = Array.isArray(approvalStatus)
//                 ? approvalStatus
//                 : [approvalStatus];
//         }

//         if (status) {
//             // If approvalStatus is an enum, convert it to an array
//             selector.currentStatus = Array.isArray(status)
//                 ? status
//                 : [status];
//         }

//         if (showFor) {
//             // Assuming showFor is an array like [2, 5, 7]
//             selector['paymentCollectedBy.refId'] = {
//                 $in: showFor.map(Number) // Convert values to numbers if necessary
//             };
//         }

//         if (paymentType) {

//             selector['price.paymentType'] = paymentType.toLowerCase();

//         }

//         if (course) {
//             // Not using $regex directly here due to CouchDB limitations
//             selector['courseInfo.lsSaId'] = parseInt(course);
//         }

//         if (channel) {
//             console.log(channel)
//             selector['channelInfo.lsSaRefId'] = parseInt(channel);
//             selector['channelInfo.lsSaRefId'] = channel;
//         }

//         if (courseType) {
//             selector['courseType'] = courseType.toLowerCase();
//         }

//         if (search) {
//             const searchRegex = `.*${search}.*`;
//             selector.$or = [
//                 { 'lead.name': { $regex: searchRegex } },
//                 { 'lead.email': { $regex: searchRegex } },
//                 { 'paymentLink': { $regex: searchRegex } },
//             ];
//         }

//         // // Calculate the number of documents to skip based on the page and pageSize
//         // const skip = (page - 1) * pageSize;
//         // // Query to get the total count of documents in the entire database
//         // const totalCountQuery = await DB.find({
//         //     selector,
//         // });
//         // const totalCount = totalCountQuery.docs.length;

//         // // Calculate the total pages
//         // const totalPages = Math.ceil(totalCount / pageSize);
//         // // Query to get the documents for the specified page
//         // const result = await DB.find({
//         //     selector,
//         //     limit: parseInt(pageSize),
//         //     skip: parseInt(skip),
//         // });

//         // const response = {
//         //     docs: result.docs,
//         //     limit: parseInt(pageSize),
//         //     totalDocs: totalCount,
//         //     page: parseInt(page),
//         //     totalPages: totalPages,
//         //     success: true,
//         // };
//         // res.json(response);

//         const result = await DB.find({
//             selector,
//         });

//         // Sort the result array based on paymentLinkGeneratedTime in descending order
//         const sortedResult = result.docs.sort((a, b) => {
//             const timeA = new Date(a.paymentLinkGeneratedTime).getTime();
//             const timeB = new Date(b.paymentLinkGeneratedTime).getTime();
//             return timeB - timeA; // Sort in descending order
//         });

//         console.log(page, pageSize)
//         // Calculate the number of documents to skip based on the page and pageSize
//         const skip = (page - 1) * pageSize;

//         // Extract only the documents for the specified page
//         const paginatedResult = sortedResult.slice(skip, skip + parseInt(pageSize));

//         const response = {
//             docs: paginatedResult,
//             // limit: parseInt(pageSize),
//             totalDocs: sortedResult.length, // Total count after sorting
//             // page: parseInt(page),
//             // totalPages: Math.ceil(sortedResult.length / pageSize),
//             success: true,
//         };
//         res.json(response);
//     } catch (error) {
//         // Handling errors
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

const csv_of_payment_link = async (req, res) => {
  console.log("hey");
  try {
    // Extracting query parameters
    var {
      paymentLinkGeneratedStartDate,
      paymentLinkGeneratedEndDate,
      paymentCaptureTimeStartDate,
      paymentCaptureTimeEndDate,
      paymentLink,
      approvalStatus,
      channel,
      paymentType,
      course,
      offer,
      courseType,
      page,
      pageSize,
      search,
      status,
      showFor,
    } = req.query;

    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    // // Ensure page and pageSize are required parameters
    // if (!page || !pageSize) {
    //     // return res.status(400).json({ error: 'page and pageSize are required parameters' });
    //     page = 1
    //     pageSize = 10
    // }

    page = page || 1;
    pageSize = pageSize || 10;

    // Building the query object
    const selector = {
      collectionName: "PaymentLink",
      currentStatus: { $ne: ['deleted'] } // Adding the collectionName filter
    };
    // Building the query object

    const sort = [{ paymentLinkGeneratedTime: "desc" }];

    // Define the index for paymentLinkGeneratedTime
    const index = {
      index: {
        fields: ["paymentLinkGeneratedTime"],
      },
      ddoc: "paymentLinkGeneratedTime-index", // You can choose a name for the index
    };

    // Create the index
    await DB.createIndex(index);

    // Adding filters based on query parameters
    if (paymentLinkGeneratedStartDate && paymentLinkGeneratedEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentLinkGeneratedEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentLinkGeneratedTime = {
        $gte: new Date(paymentLinkGeneratedStartDate),
        $lte: endDate,
      };
    }

    if (paymentCaptureTimeStartDate && paymentCaptureTimeEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentCaptureTimeEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentCaptureTime = {
        $gte: new Date(paymentCaptureTimeStartDate),
        $lte: endDate,
      };
    }

    if (paymentLink) {
      // Not using $regex directly here due to CouchDB limitations
      selector["paymentLink"] = paymentLink.toLowerCase();
    }

    if (approvalStatus) {
      // If approvalStatus is an enum, convert it to an array
      // selector.approvalStatus = Array.isArray(approvalStatus)
      //     ? approvalStatus
      //     : [approvalStatus];

      selector.approvalStatus = approvalStatus;
    }

    if (status) {
      // If approvalStatus is an enum, convert it to an array
      if (status == 'expired') {

        selector.currentStatus = { $nin: ['paid', 'cancelled', 'deleted'] },
          selector.paymentLinkExpireTime = { $lt: new Date(), $ne: null }

      } else {
        selector.currentStatus = Array.isArray(status) ? status : [status];
      }

    }

    if (showFor) {
      console.log('showFor', showFor)
      let showForArray = showFor.split(",").map(value => String(value));;
      console.log('showForArray', showForArray)
      selector["paymentCollectedBy.refId"] = {
        $in: showForArray,
      };
    }

    if (paymentType) {
      selector["price.paymentType"] = paymentType.toLowerCase();
    }

    if (course) {
      // Not using $regex directly here due to CouchDB limitations

      selector["courseInfo.lsSaId"] = course;
      selector["courseType"] = "standalone";
    }

    if (offer) {
      // Not using $regex directly here due to CouchDB limitations

      selector["courseInfo.lsSaId"] = course;
      selector["courseType"] = "bootcamp";
    }

    if (channel) {
      console.log(channel);

      selector["channelInfo.lsSaRefId"] = channel;
    }

    if (courseType) {
      selector["courseType"] = courseType.toLowerCase();
    }

    if (userInfo?.userInfo?.role?.toLowerCase() != "admin" && userInfo?.userInfo?.role?.toLowerCase() != "sales" && userInfo?.userInfo?.role?.toLowerCase() != "sales+")
      selector["linkGeneratedBy.refId"] = userInfo?.userInfo?.user_id;

    if (search) {
      const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const searchRegex = `(?i)${escapedSearch}`; // Case-insensitive regex

      selector.$or = [
        { "lead.name": { $regex: searchRegex } },
        { "lead.email": { $regex: searchRegex } },
        { "lead.phone.contactedNumber": { $regex: searchRegex } },
        { paymentLink: { $regex: searchRegex } },
        { "channelInfo.name": { $regex: searchRegex } },
        { courseType: { $regex: searchRegex } },
        { "courseInfo.label": { $regex: searchRegex } },
        { "coursePlanInfo.name": { $regex: searchRegex } },
        { "coursePlanInfo.original_price": { $regex: searchRegex } },
        { "price.paymentType": { $regex: searchRegex } },
        { "price.salesPrice": { $regex: searchRegex } },
        { "price.paymentToBeCollected": { $regex: searchRegex } },
        { "paymentCollectedBy.name": { $regex: searchRegex } },
        { "paymentCollectedBy.email": { $regex: searchRegex } },
        { "paymentCapturedInfo.gatewayName": { $regex: searchRegex } },
        { selectedPaymentGateways: { $in: [search] } },
        { paymentLinkExpireTime: { $regex: searchRegex } },
        { paymentLinkGeneratedTime: { $regex: searchRegex } },
        { pageContent: { $regex: searchRegex } },
        {
          currentStatus: {
            $elemMatch: { $regex: searchRegex },
          },
        },
        { "payee.name": { $regex: searchRegex } },
        { "payee.email": { $regex: searchRegex } },
        { "payee.phone.contactedNumber": { $regex: searchRegex } },
      ];
    }

    // // Calculate the number of documents to skip based on the page and pageSize
    // const skip = (page - 1) * pageSize;
    // // Query to get the total count of documents in the entire database
    // const totalCountQuery = await DB.find({
    //     selector,
    // });
    // const totalCount = totalCountQuery.docs.length;

    // // Calculate the total pages
    // const totalPages = Math.ceil(totalCount / pageSize);
    // // Query to get the documents for the specified page
    // const result = await DB.find({
    //     selector,
    //     limit: parseInt(pageSize),
    //     skip: parseInt(skip),
    // });

    // const response = {
    //     docs: result.docs,
    //     limit: parseInt(pageSize),
    //     totalDocs: totalCount,
    //     page: parseInt(page),
    //     totalPages: totalPages,
    //     success: true,
    // };
    // res.json(response);

    const result = await DB.find({
      selector,
      sort,
      limit: 1000,
    });

    console.log(result.docs.length);
    let pendingSelector = { ...selector };
    pendingSelector.approvalStatus = "pending";
    const pendingCount = await DB.find({
      selector: pendingSelector,
      limit: 1000,
    });

    if (selector.approvalStatus) delete selector.approvalStatus;

    const totDocs = await DB.find({
      selector,
      fields: ["_id"],
      limit: 1000,
    });

    const pendingDocsDount = pendingCount.docs.length;

    // // Sorting
    // const sortField = "paymentLinkGeneratedTime";
    // const sortOrder = "asc";

    // if (sortField && sortOrder) {
    //     result.docs.sort((a, b) => {
    //         const aValue = a.doc && a.doc[sortField];
    //         const bValue = b.doc && b.doc[sortField];

    //         if (aValue !== undefined && bValue !== undefined) {
    //             if (sortOrder === "asc") {
    //                 return aValue - bValue;
    //             } else {
    //                 return bValue - aValue;
    //             }
    //         } else {
    //             // Handle the case where either aValue or bValue is undefined
    //             // You can decide the logic for handling such cases based on your requirements
    //             // For example, you might want to consider undefined values as equal
    //             return 0;
    //         }
    //     });
    // }
    // Calculate the number of documents to skip based on the page and pageSize
    const skip = (page - 1) * pageSize;

    // Extract only the documents for the specified page
    // console.log("result", result)
    // await result.docs.reverse()
    const paginatedResult = result.docs;

    // this portion is written to append the short url
    const paginatedResultWithShortUrl = paginatedResult.map((item) => {
      if (
        item.hasOwnProperty("paymentLink") &&
        item.paymentLink &&
        item.paymentLink.split("=").length > 0
      ) {
        let paymentLink = `${item.paymentLink.split("=")[0]}=${item._id}`;
        item.paymentLink = paymentLink;
        return item;
      } else {
        return item;
      }
    });

    const response = {
      docs: paginatedResultWithShortUrl,
      totalDocs: totDocs.docs.length, // Total count after sorting
      success: true,
      pendingCount: pendingDocsDount,
    };
    res.json(response);
  } catch (error) {
    // Handling errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// function to share the payment link
const share_payment_link = async (req, res) => {

  const userInfo =
    (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    req.headers.authorization;

  console.log("userInfo", userInfo)
  try {
    const id = req.params.id;
    let newlog = req.body;

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === 'not_found') {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    // Update the field in the payload
    existingDoc.currentStatus = ["shared"];

    // let statusChangeHistoryNew = [...existingDoc.statusChangeHistory];
    // newlog.statusName = "shared";
    // statusChangeHistoryNew.push(newlog);
    // existingDoc.statusChangeHistory = statusChangeHistoryNew;
    existingDoc.statusChangeHistory.push(
      {
        statusName: "shared",
        changeTime: new Date(),
        changedBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo?.email,
          // phone: userInfo.userInfo.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone || null,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
          }
        }
      }
    )

    // Save the updated document back to the database
    const response = await DB.insert(existingDoc);

    if (response.ok) {
      res.status(200).json({
        message: "PaymentLink shared successfully",
        response
      });
    } else {
      res.status(500).json({
        message: "Failed to shared PaymentLink",
        response: response.error
      });
    }

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


const send_to_revenueSystem = async (req, res) => {
  // const id = req.params.id;
  // const userInfo =
  //     (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
  //     req.headers.authorization;

  // // const id = req.params.id;
  // // const userInfo =
  // //     (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
  // //     req.headers.authorization;

  // // console.log("userInfo", userInfo)

  // try {
  //     const payload = req.body;




  //     // Make a POST request to the API
  //     const apiResponse = await axios.post('https://revenue-system-gateway-development.lawsikho.dev/api/create_order_from_lawsikho', payload);

  //     // Handle the API response as needed
  //     console.log(apiResponse.data);
  //     if (apiResponse.data.status == 'success') {

  //         let existingDoc;
  //         try {
  //             existingDoc = await DB.get(id);
  //         } catch (error) {
  //             if (error.statusCode === 404 && error.error === 'not_found') {
  //                 res.status(404).json({
  //                     message: "PaymentLink not found",
  //                 });
  //                 return;
  //             } else {
  //                 throw error; // rethrow other errors
  //             }
  //         }

  //         // Update the field in the payload
  //         existingDoc.paymentCapturedInfo = payload.paymentCapturedInfo;
  //         existingDoc.payee = {
  //             name: payload.name,
  //             email: payload.email,
  //             phone: {
  //                 countryCode: payload.country_code,
  //                 phoneNo: payload.phone,
  //                 contactedNumber: `${payload.country_code + payload.phone}`
  //             }
  //         }
  //         // existingDoc.currentStatus = ['paid']

  //         // existingDoc.statusChangeHistory.push(
  //         //     {
  //         //         statusName: "paid",
  //         //         changeTime: new Date(),
  //         //         changedBy: {
  //         //             refId: userInfo.userInfo.user_id,
  //         //             name: userInfo.userInfo.name,
  //         //             email: userInfo.userInfo.email,
  //         //             phone: userInfo.userInfo.phone,
  //         //         }
  //         //     }
  //         // )

  //         await DB.insert(existingDoc);
  //     }

  // Update the field in the payload
  //   existingDoc.paymentCapturedInfo = payload.paymentCapturedInfo;
  //   existingDoc.payee = {
  //     name: payload.name,
  //     email: payload.email,
  //     phone: {
  //       countryCode: payload.country_code,
  //       phoneNo: payload.phone,
  //       contactedNumber: payload.contactedNumber || payload.phone,
  //     },
  //   };
  // existingDoc.currentStatus = ['paid']

  //     // Send an email to the payee using ZeptoMail
  //     const payeeEmail = payload.email; // Adjust this based on your payload structure

  //     const zeptoMailClient = new SendMailClient({ url, token });

  //     const emailContent = {
  //         from: {
  //             address: "noreply@accioesops.com",
  //             name: "Your Name",
  //         },
  //         to: [
  //             {
  //                 email_address: {
  //                     address: payeeEmail,
  //                     name: "Payee Name",
  //                 },
  //             },
  //         ],
  //         subject: "Payment Confirmation Mail",
  //         textbody: "Your Payment is Successful",
  //         htmlbody: "<strong>HTML Body of the Email</strong>",
  //         // Add any additional configurations or attachments as needed
  //     };

  //     // Send the email
  //     await zeptoMailClient.sendMail(emailContent);
  //     // Respond to the client or do other actions based on the API response
  //     return res.status(200).json({ success: true, message: 'Order created successfully in the revenue system' });

  // } catch (error) {
  //     // Handle errors
  //     console.error('Error calling revenue system API:', error);
  //     return res.status(500).json({ success: false, message: 'Internal server error' });
  // }
}

// const getPaymentLinkVersions = async (req, res) => {
//     const id = req.params.id;

//     try {
//         // Fetch revision information for the document
//         const revsInfo = await DB.get(id, { revs_info: true });

//         // Extract and return the document data for each revision
//         const versionsPromises = revsInfo._revs_info.map(async (revInfo) => {
//             const revisionNumber = revInfo.rev;
//             const doc = await DB.get(id, { rev: revisionNumber, include_docs: true });
//             return doc;
//         });

//         const resultVersions = await Promise.all(versionsPromises);

//         res.json(resultVersions);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const getPaymentLinkVersions = async (req, res) => {
  const id = req.params.id;
  const requestedRev = req.query.rev;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  try {
    // Fetch revision information for the document
    const revsInfo = await DB.get(id, { revs_info: true });

    if (!requestedRev) {
      // No specific revision requested, fetch all revisions
      const versionsPromises = revsInfo._revs_info.map(async (revInfo) => {
        const revisionNumber = revInfo.rev;
        const doc = await DB.get(id, { rev: revisionNumber, include_docs: true });

        // Apply date filter based on paymentLinkGeneratedTime
        if (isDateInRange(doc.paymentLinkGeneratedTime, fromDate, toDate)) {
          return doc;
        }

        return null; // If not in date range, return null
      });

      const resultRevisions = (await Promise.all(versionsPromises)).filter(Boolean);

      return res.json(resultRevisions);
    }

    // Fetch the document data for the requested revision
    const doc = await DB.get(id, { rev: requestedRev, include_docs: true });

    // Check the date range for the specific revision
    if (!isDateInRange(doc.paymentLinkGeneratedTime, fromDate, toDate)) {
      return res.status(404).json({ error: "Requested revision not found within the specified date range." });
    }

    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to check if a date is within the specified range
function isDateInRange(dateString, fromDate, toDate) {
  const date = new Date(dateString);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  // If only the date part is provided, adjust toDate to the end of the day
  const adjustedToDate = toDate ? new Date(toDate) : null;
  if (adjustedToDate) {
    adjustedToDate.setHours(23, 59, 59, 999);
  }

  // Check if the date is within the specified range
  return (!fromDate || date >= new Date(fromDate)) && (!adjustedToDate || date <= adjustedToDate);
}

// Test Api For Generating Short url
// const create_Short_Url = async (req, res) => {
//     try {
//         const { longUrl } = req.body;

//         const shortUrl = await create_Short_Url_for_payment_Link(longUrl);

//         res.status(200).json({
//             shortUrl
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };

// Route to redirect to the original URL
// const redirect_payment_Url = async (req, res) => {
//     try {
//         const { shortUrl } = req.params;
//         if (!shortUrl) {
//             return res.status(404).json({ error: 'Payment Link is not vlid' });
//         }
//         let paymentLink;
//         try {
//             const query = {
//                 selector: {
//                     collectionName: { "$eq": "paymentlinkmapper"},
//                     shortUrl: { "$eq": shortUrl},
//                 },
//                 fields: [ "link" ],
//                 limit:50
//             };
//             const response = await DB.find(query);
//             paymentLink = response.docs[0].link;
//             res.redirect(301, paymentLink);
//             return;
//         } catch (error) {
//             if (error.statusCode === 404 && error.error === 'not_found') {
//                 res.status(404).json({
//                     message: "PaymentLink not found",
//                 });
//                 return;
//             } else {
//                 throw error; // rethrow other errors
//             }
//             return;
//         }

//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };

// const create_Short_Url_for_payment_Link = async (longUrl) => {

//     // find whether url exist ot not
//     try {
//         var query = {
//             selector: {
//                 collectionName: { "$eq": "paymentlinkmapper"},
//                 link: { "$eq": longUrl},
//             },
//             fields: [ "shortUrl" ],
//             limit:50
//         };
//         var response = await DB.find(query);
//         var shortUrl = response.docs[0].shortUrl;
//         var shortUrlFull = `${process.env.DOMAIN}/payment/${shortUrl}`;
//         return shortUrlFull;

//     } catch (error) {
//         var shortUrl = shortid.generate();
//         var shortUrlFull = `${process.env.DOMAIN}/payment/${shortUrl}`;

//         var collectionName = "paymentlinkmapper";
//         var payload = {
//             collectionName,
//             link: longUrl,
//             shortUrl: shortUrl
//         }
//         var response = await generate_payment_link_mapper(payload);

//         if (response.hasOwnProperty("ok")) {
//             return shortUrlFull;
//         } else {
//             return {
//                 message: "Internal server error"
//             }
//         }
//     }
// };

// Helper function to check if a date is within the specified range
function isDateInRange(dateString, fromDate, toDate) {
  const date = new Date(dateString);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  // If only the date part is provided, adjust toDate to the end of the day
  const adjustedToDate = toDate ? new Date(toDate) : null;
  if (adjustedToDate) {
    adjustedToDate.setHours(23, 59, 59, 999);
  }

  // Check if the date is within the specified range
  return (
    (!fromDate || date >= new Date(fromDate)) &&
    (!adjustedToDate || date <= adjustedToDate)
  );
}

// Test Api For Generating Short url
// const create_Short_Url = async (req, res) => {
//     try {
//         const { longUrl } = req.body;

//         const shortUrl = await create_Short_Url_for_payment_Link(longUrl);

//         res.status(200).json({
//             shortUrl
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };

// Route to redirect to the original URL
// const redirect_payment_Url = async (req, res) => {
//     try {
//         const { shortUrl } = req.params;
//         if (!shortUrl) {
//             return res.status(404).json({ error: 'Payment Link is not vlid' });
//         }
//         let paymentLink;
//         try {
//             const query = {
//                 selector: {
//                     collectionName: { "$eq": "paymentlinkmapper"},
//                     shortUrl: { "$eq": shortUrl},
//                 },
//                 fields: [ "link" ],
//                 limit:50
//             };
//             const response = await DB.find(query);
//             paymentLink = response.docs[0].link;
//             res.redirect(301, paymentLink);
//             return;
//         } catch (error) {
//             if (error.statusCode === 404 && error.error === 'not_found') {
//                 res.status(404).json({
//                     message: "PaymentLink not found",
//                 });
//                 return;
//             } else {
//                 throw error; // rethrow other errors
//             }
//             return;
//         }

//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };

// const create_Short_Url_for_payment_Link = async (longUrl) => {

//     // find whether url exist ot not
//     try {
//         var query = {
//             selector: {
//                 collectionName: { "$eq": "paymentlinkmapper"},
//                 link: { "$eq": longUrl},
//             },
//             fields: [ "shortUrl" ],
//             limit:50
//         };
//         var response = await DB.find(query);
//         var shortUrl = response.docs[0].shortUrl;
//         var shortUrlFull = `${process.env.DOMAIN}/payment/${shortUrl}`;
//         return shortUrlFull;

//     } catch (error) {
//         var shortUrl = shortid.generate();
//         var shortUrlFull = `${process.env.DOMAIN}/payment/${shortUrl}`;

//         var collectionName = "paymentlinkmapper";
//         var payload = {
//             collectionName,
//             link: longUrl,
//             shortUrl: shortUrl
//         }
//         var response = await generate_payment_link_mapper(payload);

//         if (response.hasOwnProperty("ok")) {
//             return shortUrlFull;
//         } else {
//             return {
//                 message: "Internal server error"
//             }
//         }
//     }
// };

const edit_payment_link = async (req, res) => {
  try {
    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    console.log("userInfo", userInfo);
    const id = req.params.id;
    console.log(id);

    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === "not_found") {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    // Update the field in the payload
    existingDoc.editApprovelStatus = "pending";

    console.log("existing docs", existingDoc);

    // Save the updated document back to the database
    const response = await DB.insert(existingDoc);

    if (response.ok) {
      const editPaymentLinkRequestPayload = req.body;

      const editPaymentLinkPayload = {
        collectionName: "EditPaymentLink",
        paymentLinkId: id,
        changeRequest: editPaymentLinkRequestPayload,
        createdAt: new Date(),
        createdBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo?.email,
          // phone: userInfo.userInfo.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone || null,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone
              }`,
          },
        },
        status: "Active",
      };

      console.log("editPaymentLinkPayload:", editPaymentLinkPayload);

      // Call the insertItem function with the modified payload
      const editPaymentLinkResponse =
        await edit_payment_link_validation_insertItem(editPaymentLinkPayload);

      // Check the response and send appropriate status and message
      if (editPaymentLinkResponse.hasOwnProperty("ok")) {
        return res.status(200).json({
          message: "Change requested sucessfully",
          response: response,
        });
      } else {
        return res.status(400).json({
          message:
            "Updated from paymenLink Schema but failed to store in EditPaymentLink Schema",
          response: editPaymentLinkResponse.error,
        });
      }
    } else {
      return res.status(500).json({
        message: "Failed to edit PaymentLink",
        response: response.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const approveRejectAprovalEdit = async (req, res) => {
  try {
    console.log(req.headers.authorization);
    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    console.log("userInfo", userInfo);
    const { message, action } = req.body;
    console.log(req.body);

    //   id of an object which has all the changes to be done
    const id = req.params.id;
    console.log(id);
    let editPaymentDoc = await DB.get(id); //get document which has changes

    if (!editPaymentDoc) {
      res.status(404).json({
        message: "Edit PaymentLink not found",
      });
      return;
    }

    console.log(editPaymentDoc);
    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(editPaymentDoc.paymentLinkId); // get the payment link which has to be edited
    } catch (error) {
      if (error.statusCode === 404 && error.error === "not_found") {
        res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    // Create a new object for approvalStatusChangeHistory
    const approvalStatusChange = {
      statusName: "edit",
      changeTime: new Date(),
      changedBy: {
        refId: userInfo.userInfo?.user_id,
        name: userInfo.userInfo?.name,
        email: userInfo.userInfo?.email,
        // phone: userInfo.userInfo.phone,
        phone: {
          countryCode: userInfo.userInfo?.countryCode || 91,
          phoneNo: userInfo.userInfo?.phone || null,
          contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone
            }`,
        },
        otherInfo: {
          before: {
            leadName: existingDoc.lead?.name,
            leadEmail: existingDoc.lead?.email,
            leadCountryCode: existingDoc.lead?.phone?.countryCode,
            leadPhone: existingDoc.lead?.phone?.phoneNo,
            paymentType: existingDoc.price?.paymentType,
            paymentTypeId: existingDoc.price?.paymentTypeId,
          },
          after: editPaymentDoc.changeRequest,
          actionType: action,
          editedBy: {
            refId: editPaymentDoc.createdBy.refId,
            name: editPaymentDoc.createdBy?.name,
            email: editPaymentDoc.createdBy.email,
            // phone: userInfo.userInfo.phone,
            phone: {
              countryCode: editPaymentDoc.createdBy.phone.countryCode || 91,
              phoneNo: editPaymentDoc.createdBy.phone.phoneNo || null,
              contactedNumber: `${editPaymentDoc.createdBy.phone.countryCode ||
                91 + editPaymentDoc.createdBy.phone.phoneNo
                }`,
            },
          },
        },
      },
      message: {
        code: null,
        text: message,
      },
    };
    existingDoc.statusChangeHistory.push(approvalStatusChange);
    console.log("existing docs updated", existingDoc);
    if (action == "approved") {
      existingDoc.lead.name =
        editPaymentDoc.changeRequest.leadName || existingDoc.lead.name;
      existingDoc.lead.email =
        editPaymentDoc.changeRequest.leadEmail || existingDoc.lead.email;
      existingDoc.lead.phone.countryCode =
        editPaymentDoc.changeRequest.leadCountryCode ||
        existingDoc.lead.phone.countryCode;
      existingDoc.lead.phone.phoneNo =
        editPaymentDoc.changeRequest.leadPhone ||
        existingDoc.lead.phone.phoneNo;
      existingDoc.lead.phone.contactedNumber = `${existingDoc.lead.phone.countryCode ||
        91 + existingDoc.lead.phone.phoneNo
        }`;
      existingDoc.price.paymentType =
        editPaymentDoc.changeRequest.paymentType ||
        existingDoc.price.paymentType;
      existingDoc.price.paymentTypeId =
        editPaymentDoc.changeRequest.paymentTypeId ||
        existingDoc.price.paymentTypeId;
      existingDoc.dataModified = true;
    }
    existingDoc.editApprovelStatus = "na";
    // Save the updated document back to the database
    const response = await DB.insert(existingDoc);
    editPaymentDoc.status = "Deleted";
    await DB.insert(editPaymentDoc);

    if (action == "approved") {
      const editRevenuePayload = {
        name: existingDoc.payee?.name,
        email: existingDoc.payee?.email,
        phone: existingDoc.payee?.phone?.phoneNo,
        country_id: existingDoc.payee?.phone?.countryCode,
        brand_id: existingDoc.channelInfo.lsSaRefId,
        data: [
          {
            id: editPaymentDoc.paymentLinkId,
            Installment: existingDoc.price.paymentTypeId,
            payment_system: 1,
          },
        ],
      };

      console.log("editRevenuePayload:", editRevenuePayload);

      const MQPayload = [
        {
          send_url: `${process.env.BASE_URL_GATEWAY}/api/payment/online/update/${editPaymentDoc.paymentLinkId}`,
          payload: editRevenuePayload,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "userid": existingDoc.linkGeneratedBy.refId,
            "user-email": existingDoc.linkGeneratedBy.email,
            "user-details": `{"user_id":${existingDoc.linkGeneratedBy?.refId},"name":${existingDoc.linkGeneratedBy?.name},"email":${existingDoc.linkGeneratedBy?.email},"phone": ${existingDoc.linkGeneratedBy?.phone?.phoneNo}}`
          },
          ack_url: "",
        },
      ];

      const queueResponse = await pushToQueue(MQPayload);
    }

    return res.status(200).json({
      message: `edit request ${action} successfully !`,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      err: error.message,
    });
  }
};

const getPendingEditPaymentList = async (req, res) => {
  try {
    var {
      paymentLinkGeneratedStartDate,
      paymentLinkGeneratedEndDate,
      paymentCaptureTimeStartDate,
      paymentCaptureTimeEndDate,
      paymentLink,
      approvalStatus,
      channel,
      paymentType,
      course,
      offer,
      courseType,
      page,
      pageSize,
      search,
      status,
      showFor,
      paymentGateway,
    } = req.query;

    const userInfo =
      (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
      req.headers.authorization;

    console.log("userInfo:", userInfo);

    // let totalPaidCount = 0;
    // let totalSharedCount = 0;
    // let totalExpiredCount = 0;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10;
    console.log(page);

    // Building the query object
    const selector = {
      collectionName: "PaymentLink", // Adding the collectionName filter
      currentStatus: { $ne: ["deleted"] },
    };
    // Building the query object

    const sort = [{ paymentLinkGeneratedTime: "desc" }];

    // Define the index for paymentLinkGeneratedTime
    const index = {
      index: {
        fields: ["paymentLinkGeneratedTime"],
      },
      ddoc: "paymentLinkGeneratedTime-index", // You can choose a name for the index
    };

    // Create the index
    await DB.createIndex(index);

    // Adding filters based on query parameters
    if (paymentLinkGeneratedStartDate && paymentLinkGeneratedEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentLinkGeneratedEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentLinkGeneratedTime = {
        $gte: new Date(paymentLinkGeneratedStartDate),
        $lte: endDate,
      };
    }

    if (paymentCaptureTimeStartDate && paymentCaptureTimeEndDate) {
      // Adjusting the end date to include the entire day
      const endDate = new Date(paymentCaptureTimeEndDate);
      endDate.setHours(23, 59, 59, 999);

      selector.paymentCaptureTime = {
        $gte: new Date(paymentCaptureTimeStartDate),
        $lte: endDate,
      };
    }

    if (paymentLink) {
      // Not using $regex directly here due to CouchDB limitations
      selector["paymentLink"] = paymentLink.toLowerCase();
    }

    if (approvalStatus) {
      selector.approvalStatus = approvalStatus;
    }

    if (userInfo?.userInfo?.role?.toLowerCase() != "admin" && userInfo?.userInfo?.role?.toLowerCase() != "sales" && userInfo?.userInfo?.role?.toLowerCase() != "sales+") {
      selector.$or = [
        { "linkGeneratedBy.email": userInfo?.userInfo?.email },
        { "paymentCollectedBy.email": userInfo?.userInfo?.email },
      ];
    }

    if (status) {
      // If approvalStatus is an enum, convert it to an array
      if (status == "expired") {
        (selector.currentStatus = { $nin: ["paid", "cancelled", "deleted"] }),
          (selector.paymentLinkExpireTime = { $lt: new Date(), $ne: null });
      } else if (status == "edited") {
        selector.dataModified = true;
      } else {
        selector.currentStatus = Array.isArray(status) ? status : [status];
      }
    }

    if (showFor) {
      console.log('showFor', showFor)
      let showForArray = showFor.split(",").map(value => String(value));
      console.log('showForArray', showForArray)
      selector["paymentCollectedBy.refId"] = {
        $in: showForArray,
      };
    }

    if (paymentType) {
      console.log('showFor', paymentType)
      let paymentArray = paymentType.split(",").map(value => String(value).toLowerCase());
      console.log('paymentArray', paymentArray)
      selector["price.paymentType"] = {
        $in: paymentArray,
      };
    }

    if (course) {
      // Not using $regex directly here due to CouchDB limitations

      console.log('course', course)
      let courseArray = course.split(",").map(value => String(value));

      console.log('courseArray', courseArray)

      selector["courseInfo.lsSaId"] = {
        $in: courseArray,
      };
      selector["courseType"] = "standalone";
    }

    if (offer) {
      // Not using $regex directly here due to CouchDB limitations

      console.log('offer', offer)
      let offerArray = offer.split(",").map(value => String(value));
      console.log('offerArray', offerArray)

      selector["courseInfo.lsSaId"] = {
        $in: offerArray,
      };
      selector["courseType"] = "bootcamp";
    }

    if (channel) {
      console.log(channel);

      selector["channelInfo.lsSaRefId"] = channel;
    }

    if (courseType) {
      selector["courseType"] = courseType.toLowerCase();
    }

    // Additional filter for payment gateway
    if (paymentGateway) {
      selector["paymentCapturedInfo.gatewayName"] = paymentGateway;
    }

    console.log(selector);

    if (search) {
      const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const searchRegex = `(?i)${escapedSearch}`; // Case-insensitive regex

      selector.$or = [
        { "lead.name": { $regex: searchRegex } },
        { "lead.email": { $regex: searchRegex } },
        { "lead.phone.contactedNumber": { $regex: searchRegex } },
        { paymentLink: { $regex: searchRegex } },
        { "channelInfo.name": { $regex: searchRegex } },
        { courseType: { $regex: searchRegex } },
        { "courseInfo.label": { $regex: searchRegex } },
        { "coursePlanInfo.name": { $regex: searchRegex } },
        { "coursePlanInfo.original_price": { $regex: searchRegex } },
        { "price.paymentType": { $regex: searchRegex } },
        { "price.salesPrice": { $regex: searchRegex } },
        { "price.paymentToBeCollected": { $regex: searchRegex } },
        { "paymentCollectedBy.name": { $regex: searchRegex } },
        { "linkGeneratedBy.name": { $regex: searchRegex } },
        { "paymentCapturedInfo.gatewayName": { $regex: searchRegex } },
        { selectedPaymentGateways: { $in: [search] } },
        { paymentLinkExpireTime: { $regex: searchRegex } },
        { paymentLinkGeneratedTime: { $regex: searchRegex } },
        { pageContent: { $regex: searchRegex } },
        {
          currentStatus: {
            $elemMatch: { $regex: searchRegex },
          },
        },
        { "payee.name": { $regex: searchRegex } },
        { "payee.email": { $regex: searchRegex } },
        { "payee.phone.contactedNumber": { $regex: searchRegex } },
      ];
    }

    const totDocsResponse = {
      total_rows: 100000
    }

    // const totDocsResponse = await DB.list({
    //   include_docs: true,
    //   limit: 0, // Set limit to 0 to get only metadata without documents
    // });

    const selector1 = {
      collectionName: "EditPaymentLink",
      status: { $ne: "Deleted" }, // Adding the collectionName filter
    };

    const editResultSort = [{ createdAt: "desc" }];

    // Define the index for createdAt
    const indexForEditResult = {
      index: {
        fields: ["createdAt"],
      },
      ddoc: "createdAt-index", // You can choose a name for the index
    };

    // Create the index for editResult
    await DB.createIndex(indexForEditResult);

    const editResult = await DB.find({
      selector: selector1,
      limit: totDocsResponse.total_rows,
      sort: editResultSort,
    });

    let editedId = []

    editResult.docs.forEach((editPaymentLink) => {
      editedId.push(editPaymentLink.paymentLinkId)
    });

    selector._id = {
      $in: editedId,
    };

    console.log(selector)

    const result = await DB.find({
      selector,
      // limit: totDocsResponse.total_rows,
    });


    // Retrieve total counts for paid, shared, and expired
    // const paidCount = await DB.find({
    //   selector: {
    //     ...selector,
    //     statusChangeHistory: { $elemMatch: { statusName: "paid" } },
    //   },
    //   limit: totDocsResponse.total_rows,
    // });

    // const sharedCount = await DB.find({
    //   selector: {
    //     ...selector,
    //     $or: [
    //       { statusChangeHistory: { $elemMatch: { statusName: "shared" } } },
    //       { currentStatus: ["shared"] },
    //     ],
    //   },
    //   limit: totDocsResponse.total_rows,
    // });

    // Creating a new object without the currentStatus key
    const newSelector = { ...selector };
    delete newSelector.currentStatus;

    // Output the new selector object
    console.log("newSelector", newSelector);

    // const expiredCount = await DB.find({
    //   selector: {
    //     ...newSelector,
    //     currentStatus: { $nin: ["paid", "cancelled", "deleted"] },
    //     paymentLinkExpireTime: { $lt: new Date(), $ne: null },
    //   },
    //   limit: totDocsResponse.total_rows,
    // });
    console.log("ff", selector);

    // if (approvalStatus == "pending") {
    //   totalPaidCount = 0;
    // } else {
    //   totalPaidCount = paidCount.docs.length;
    // }

    // totalSharedCount = sharedCount.docs.length;

    // if (status !== "paid") {
    //   totalExpiredCount = expiredCount.docs.length;
    // } else {
    //   totalExpiredCount = 0;
    // }

    let pendingSelector = { ...selector };
    pendingSelector.approvalStatus = "pending";
    // const pendingCount = await DB.find({
    //   selector: pendingSelector,
    //   limit: totDocsResponse.total_rows,
    // });

    if (selector.approvalStatus) delete selector.approvalStatus;

    // const totDocs = await DB.find({
    //   selector,
    //   fields: ["_id"],
    //   limit: totDocsResponse.total_rows,
    // });

    // const pendingDocsDount = pendingCount.docs.length;

    // Array to store payment links
    const paymentLinksArray = [];

    editResult.docs.forEach((editPaymentLink) => {
      console.log("editPaymentLink", editPaymentLink);

      try {
        const matchingDoc = result.docs.find((doc) => editPaymentLink.paymentLinkId === doc._id);

        if (matchingDoc) {
          console.log("document", matchingDoc);
          const paymentLink = { ...matchingDoc, editPaymentLinks: editPaymentLink };
          console.log("payment link", paymentLink);

          // Add paymentLink to the array
          paymentLinksArray.push(paymentLink);
        }
      } catch (error) {
        console.error(`Error fetching payment link: ${error.message}`);
      }
    });


    // Implement pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPaymentLinksArray = paymentLinksArray.slice(
      startIndex,
      endIndex
    );

    // Calculate total pages
    const totalPages = Math.ceil(paymentLinksArray.length / pageSize);


    // Reverse statusChangeHistory array
    await paginatedPaymentLinksArray?.forEach((doc) => {
      if (doc) {
        //console.log("doc", doc);
        if (doc.statusChangeHistory) {
          doc.statusChangeHistory.reverse();
        }
        if (doc.approvalStatusChangeHistory) {
          doc.approvalStatusChangeHistory.reverse();
        }
      }
    });

    // Remove circular references from the response
    return res.status(200).json({
      message: "got list successfully!",
      error: false,
      totalPaymentLinks: result.docs.length,
      // pendingCount: pendingDocsDount,
      // totalPaidCount,
      // totalSharedCount,
      // totalExpiredCount,
      totalDocuments: paymentLinksArray.length, // Total documents in the array
      totalDocumentsOnPage: paginatedPaymentLinksArray.length, // Total documents on the current page
      pageSize: pageSize,
      currentPage: page,
      totalPages: totalPages, // Total pages
      paymentLinks: paginatedPaymentLinksArray,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      err: error.message,
    });
  }
};

const onlyEditPaymentList = async (req, res) => {
  try {

    const totDocsResponse = await DB.list({
      include_docs: true,
      limit: 0, // Set limit to 0 to get only metadata without documents
    });

    const selector1 = {
      collectionName: "EditPaymentLink",
      status: { $ne: "Deleted" }, // Adding the collectionName filter
    };

    const editResultSort = [{ createdAt: "desc" }];

    // Define the index for createdAt
    const indexForEditResult = {
      index: {
        fields: ["createdAt"],
      },
      ddoc: "createdAt-index", // You can choose a name for the index
    };

    // Create the index for editResult
    await DB.createIndex(indexForEditResult);

    const editResult = await DB.find({
      selector: selector1,
      limit: totDocsResponse.total_rows,
      sort: editResultSort,
    });

    return res.status(200).json({
      message: "got list successfully!",
      error: false,
      editResult
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      err: error.message,
    });
  }
}

const add_to_revenue = async (req, res) => {
  const id = req.params.paymentLinkId;
  console.log(id);
  const payload = req.body

  try {


    // Retrieve existing document
    let existingDoc;
    try {
      existingDoc = await DB.get(id);
    } catch (error) {
      if (error.statusCode === 404 && error.error === 'not_found') {
        return res.status(404).json({
          message: "PaymentLink not found",
        });
        return;
      } else {
        throw error; // rethrow other errors
      }
    }

    if (existingDoc.currentStatus.includes("paid")) {
      if (existingDoc.isRevenueAddedSendToQueue != true) {

        let addRevenueResponse = await sendToLawsikhoOrSkillerbitra(payload, existingDoc, null)

        // existingDoc.isRevenueAddedSendToQueue = true;

        // await DB.insert(existingDoc);

        return res.status(200).json({
          message: "Added sucessfully",
          addRevenueResponse
        });
      } else {
        return res.status(400).json({
          message: "isRevenueAddedSendToQueue set to true",
        });
      }
    } else {
      return res.status(400).json({
        message: "currentStatus is not paid",
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      err: error.message,
    });
  }
}

module.exports = {
  generated_payment_link,
  cancel_payment_link,
  change_status_to_paid,
  change_status_to_processing,
  change_status_to_paid_webhook,
  approval_status,
  regenerate_payment_link,
  get_all_payment_link,
  get_all_report_for_payment_link,
  csv_of_payment_link,
  share_payment_link,
  send_to_revenueSystem,
  getPaymentLinkVersions,
  getPaymentLinkById,
  edit_payment_link,
  getPendingEditPaymentList,
  approveRejectAprovalEdit,
  onlyEditPaymentList,
  add_to_revenue
  // create_Short_Url,
  // redirect_payment_Url
};
