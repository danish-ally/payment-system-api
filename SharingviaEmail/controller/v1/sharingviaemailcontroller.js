const { shareviaemail_insertitem } = require("../../model/sharingviaemail");
const DB = require("../../../common/couchdb");
const { SendMailClient } = require("zeptomail");
const {
  generated_payment_link_validation_insertItem,
} = require("../../../paymentLink/models/PaymentLink");
const jwt = require("jsonwebtoken");
const url = process.env.ZEPTO_MAIL_URL;
const token = process.env.ZEPTO_MAIL_TOKEN;
const emailtemplate = require("../../../common/emailTemplate/mail");
const skillArbiEmail = require('../../../common/emailTemplate/skillArbitraEmail')
const mailgun = require("mailgun-js");

// const Shareviaemail_share = async (req, res) => {
//   const userInfo =
//     (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
//     req.headers.authorization;

//   console.log("userInfo", userInfo);
//   try {
//     // Get the JSON payload from the request body
//     const payload = req.body;

//     // Add the additional property "collectionName" to the payload
//     payload.collectionName = "ShareviaEmail";

//     // Call the insertItem function with the modified payload
//     const response = await shareviaemail_insertitem(payload);

//     const id = req.params.id;
//     // Retrieve existing document
//     let Paymentlink;

//     Paymentlink = await DB.get(id);
//     console.log(Paymentlink);

//     let client = new SendMailClient({ url, token });

//     // let newpaymentLink = `${Paymentlink.paymentlink.split("=")[0]}=${Paymentlink._id}`;

//     // console.log(newpaymentLink,"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")

//     let newpaymentlink = `${Paymentlink.paymentLink.split("=")[0]}=${
//       Paymentlink._id
//     }`;

//     console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

//     console.log(
//       Paymentlink.price.paymentToBeCollected,
//       "amountttttttttttttttttttttt"
//     );

//     // mypaymentLink = `${newpaymentlink.newpaymentlink.split("=")[0]}=${newpaymentlink._id}`;

//     let modifiedUserHTML = emailtemplate.replace(/{name}/g, req.body.email);

//     // https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/logo-red.png

//     if (Paymentlink.channelInfo.lsSaRefId=='1'){
//       modifiedUserHTML = modifiedUserHTML.replace(
//         /{logoImage}/g,
//         'https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/logo-red.png'
//       );
//     }else if(Paymentlink.channelInfo.lsSaRefId=='2'){
//       modifiedUserHTML = modifiedUserHTML.replace(
//         /{logoImage}/g,
//         'https://admin.skillarbitra.ge/assets/uploads/media-library/06-pm-1701263078.png'
//       );
//     }else{
//       modifiedUserHTML = modifiedUserHTML.replace(
//         /{logoImage}/g,
//         'https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/logo-red.png'
//       );
//     }

//     modifiedUserHTML = modifiedUserHTML.replace(
//       /{Paymentlink}/g,
//       newpaymentlink
//     );

//     modifiedUserHTML = modifiedUserHTML.replace(
//       /{amount}/g,
//       Paymentlink.price.paymentToBeCollected
//     );

//     modifiedUserHTML = modifiedUserHTML.replace(
//       /{linktoredirect}/g,
//       newpaymentlink
//     );

//     // console.log(Paymentlink._id,"sssssssssssssssssssssssssssss0000000000000000000000")

//     const emailContent = {
//       from: {
//         address: "noreply@accioesops.com",
//         name: "PaymentSystem",
//       },
//       to: [
//         {
//           email_address: {
//             address: req.body.email,
//             name: "test1",
//           },
//         },
//       ],
//       subject: "Sending with ZeptoMail to have a good experience",
//       textbody: "Shareviaemail Email",
//       //htmlbody: Paymentlink.paymentLink,
//       htmlbody: modifiedUserHTML,
//       cc: [
//         {
//           email_address: {
//             address: "test3@example.com",
//             name: "test3",
//           },
//         },
//       ],
//       bcc: [
//         {
//           email_address: {
//             address: "test4@example.com",
//             name: "test4",
//           },
//         },
//       ],
//       track_clicks: true,
//       track_opens: true,
//       client_reference: "<client reference>",
//       mime_headers: {
//         "X-Zylker-User": "test-xxxx",
//       },
//     };

//     // Send email

//     // Check the response and send appropriate status and message
//     if (response.hasOwnProperty("ok")) {
//       client
//         .sendMail(emailContent)
//         .then((resp) => console.log("Email sent successfully"))
//         .catch((error) => console.log("Error details:", error.error.details));

//       const id = req.params.id;
//       // Retrieve existing document
//       let existingDoc;
//       try {
//         existingDoc = await DB.get(id);
//       } catch (error) {
//         if (error.statusCode === 404 && error.error === "not_found") {
//           res.status(404).json({
//             message: "PaymentLink not found",
//           });
//           return;
//         } else {
//           throw error; // rethrow other errors
//         }
//       }

//       // Update the field in the payload
//       existingDoc.currentStatus = ["shared"];

//       // let statusChangeHistoryNew = [...existingDoc.statusChangeHistory];
//       // newlog.statusName = "shared";
//       // statusChangeHistoryNew.push(newlog);
//       // existingDoc.statusChangeHistory = statusChangeHistoryNew;
//       existingDoc.statusChangeHistory.push({
//         statusName: "shared",
//         changeTime: new Date(),
//         changedBy: {
//           refId: userInfo.userInfo.user_id,
//           name: userInfo.userInfo.name,
//           email: userInfo.userInfo.email,
//           phone: userInfo.userInfo.phone,
//         },
//       });

//       await DB.insert(existingDoc);

//       res.status(201).json({
//         message: "Sharing Info Created Successfully",
//         response,
//       });
//     } else {
//       res.status(400).json({
//         message: "Sharing info Not Created",
//         response: response.error.details,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

//Mailgun Configuration

//M

//Mailgun Configuration
const Shareviaemail_share = async (req, res) => {
  console.log("jjjjjjj");
  const userInfo =
    (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    req.headers.authorization;

  console.log("userInfo", userInfo);
  try {
    // Get the JSON payload from the request body
    const payload = req.body;

    // Add the additional property "collectionName" to the payload
    payload.collectionName = "ShareviaEmail";

    // Call the insertItem function with the modified payload
    const response = await shareviaemail_insertitem(payload);

    const id = req.params.id;
    console.log(id, response, "dddddddddddddddd");
    // Retrieve existing document
    let Paymentlink;

    Paymentlink = await DB.get(id);
    console.log(Paymentlink);

    // let client = new SendMailClient({ url, token });

    // let newpaymentLink = `${Paymentlink.paymentlink.split("=")[0]}=${Paymentlink._id}`;

    // console.log(newpaymentLink,"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")

    let newpaymentlink = `${Paymentlink.paymentLink.split("=")[0]}=${Paymentlink._id
      }`;

    console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

    console.log(
      Paymentlink.price.paymentToBeCollected,
      "amountttttttttttttttttttttt"
    );

    let leadName = Paymentlink.lead.name;
    // mypaymentLink = `${newpaymentlink.newpaymentlink.split("=")[0]}=${newpaymentlink._id}`;

    

    // https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/logo-red.png
    let fromEmail;

    let newapiKey;
    let newdomain;

    console.log("gggggggggggggggggg");
    let modifiedUserHTML;
    if (Paymentlink.channelInfo.lsSaRefId == "1") {
      (newapiKey = process.env.LAWSIKHO_KEY),
        (newdomain = process.env.LAWSIKHO_DOMAIN),
        (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
        
      modifiedUserHTML = emailtemplate.replace(/{name}/g, leadName);
      modifiedUserHTML = modifiedUserHTML.replace(
        /{logoImage}/g,
        "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
      );
      modifiedUserHTML = modifiedUserHTML.replace(
        /{channelName}/g,
        Paymentlink.channelInfo.name
      );
    } else if (Paymentlink.channelInfo.lsSaRefId == "2") {
      (newapiKey = process.env.SKILLARBITRAGE_KEY),
        (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
        (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
       
      modifiedUserHTML = skillArbiEmail.replace(/{name}/g, leadName);
      modifiedUserHTML = modifiedUserHTML.replace(
        /{logoImage}/g,
        "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
      );
    
    } else {
      (newapiKey = process.env.LAWSIKHO_KEY),
        (newdomain = process.env.LAWSIKHO_DOMAIN),
        (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
        
      modifiedUserHTML = emailtemplate.replace(/{name}/g, leadName);
      modifiedUserHTML = modifiedUserHTML.replace(
        /{logoImage}/g,
        "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
      );
      modifiedUserHTML = modifiedUserHTML.replace(
        /{channelName}/g,
        Paymentlink.channelInfo.name
      );
    }

    console.log(newapiKey, newdomain);

    let mg;
    if (Paymentlink.channelInfo.lsSaRefId == "1") {
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

    modifiedUserHTML = modifiedUserHTML.replace(
      /{Paymentlink}/g,
      newpaymentlink
    );

    modifiedUserHTML = modifiedUserHTML.replace(
      /{amount}/g,
      Paymentlink.price.paymentToBeCollected
    );

    modifiedUserHTML = modifiedUserHTML.replace(
      /{linktoredirect}/g,
      newpaymentlink
    );

    // console.log(Paymentlink._id,"sssssssssssssssssssssssssssss0000000000000000000000")

    const emailContent = {
      from: fromEmail,
      to: req.body.email,
      subject: "Payment Link Shared With You",
      text: "Shareviaemail Email",
      html: modifiedUserHTML,
    };

    console.log(emailContent, "aaaaaaaaaaaa");

    // Send email

    // Check the response and send appropriate status and message
    if (response.hasOwnProperty("ok")) {
      const data = await mg.messages().send(emailContent);
      console.log(data, "email sent successfully");

      const id = req.params.id;
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
      existingDoc.currentStatus = ["shared"];

      // let statusChangeHistoryNew = [...existingDoc.statusChangeHistory];
      // newlog.statusName = "shared";
      // statusChangeHistoryNew.push(newlog);
      // existingDoc.statusChangeHistory = statusChangeHistoryNew;
      existingDoc.statusChangeHistory.push({
        statusName: "shared",
        changeTime: new Date(),
        changedBy: {
          refId: userInfo.userInfo?.user_id,
          name: userInfo.userInfo?.name,
          email: userInfo.userInfo.email,
          // phone: userInfo.userInfo.phone,
          phone: {
            countryCode: userInfo.userInfo?.countryCode || 91,
            phoneNo: userInfo.userInfo?.phone,
            contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
          }
        },
      });

      await DB.insert(existingDoc);

      res.status(201).json({
        message: "Sharing Info Created Successfully",
        response,
      });
    } else {
      res.status(400).json({
        message: "Sharing info Not Created",
        response: response.error.details,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const Generate_and_share = async (req, res) => {
  const userInfo =
    (await jwt.decode(req.headers.authorization.split(" ")[1])) ||
    req.headers.authorization;

  console.log("userInfo", userInfo);
  try {
    // Get the JSON payload from the request body

    // Get the JSON payload from the request body
    const payload = req.body;
    console.log("payload before", payload);
    payload.collectionName = "PaymentLink";
    payload.paymentLinkGeneratedTime = new Date();
    payload.price.paymentType = payload.price.paymentType.toLowerCase();
    payload.courseType = payload.courseType.toLowerCase();

    if (!payload.lead.phone.countryCode) {
      payload.lead.phone.countryCode = 91;
    }

    payload.lead.phone.contactedNumber = `+${payload.lead.phone.countryCode}${payload.lead.phone.phoneNo}`

    const channelId = payload.channelInfo.lsSaRefId;
    

    if (payload.price.originalPrice === payload.price.salesPrice) {
      payload.approvalStatus = "approved";

      payload.currentStatus = ["shared"];
      payload.statusChangeHistory = [
        {
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
          },
        },
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
              phoneNo: userInfo.userInfo?.phone,
              contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
            }
          },
        },
      ];

      // Link is generated by
      payload.linkGeneratedBy = {
        refId: userInfo.userInfo.user_id,
        name: userInfo.userInfo.name,
        email: userInfo.userInfo.email,
        // phone: userInfo.userInfo.phone,
        phone: {
          countryCode: userInfo.userInfo?.countryCode || 91,
          phoneNo: userInfo.userInfo?.phone,
          contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        }
      };
      // payload.currentStatus = ["shared"];
      // payload.statusChangeHistory.push({
      //   statusName: "shared",
      //   changeTime: new Date(),
      //   changedBy: {
      //     refId: userInfo.userInfo.user_id,
      //     name: userInfo.userInfo.name,
      //     email: userInfo.userInfo.email,
      //     // phone: userInfo.userInfo.phone,
      //     phone: {
      //       countryCode: userInfo.userInfo?.countryCode || 91,
      //       phoneNo: userInfo.userInfo?.phone,
      //       contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
      //     }
      //   },
      // });

      // Call the insertItem function with the modified payload
      const response = await generated_payment_link_validation_insertItem(
        payload
      );
      // Check the response and send appropriate status and message



      var tokenPayload = {
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
        // id: response.id
      };

      // if (response.hasOwnProperty("ok")) {
      //   console.log(response.id);
      //   tokenPayload.id = response.id;

      //   // Set token expiration based on paymentLinkExpireTime
      //   const expirationTimeInSeconds = Math.floor(
      //     (new Date(tokenPayload.paymentLinkExpireTime) - new Date()) / 1000
      //   );

      //   const jwtToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {
      //     expiresIn: expirationTimeInSeconds,
      //   });

      //   let existingDoc = await DB.get(response.id);
      //   existingDoc.token = jwtToken;

      //   if (req.body.channelInfo.name == "Skillarbitra") {
      //     existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${jwtToken}`;
      //   }

      //   if (req.body.channelInfo.name == "Lawsikho") {
      //     existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${jwtToken}`;
      //   }
      //   // Save the updated document back to the database
      //   await DB.insert(existingDoc);

      //   const payload = {
      //     paymentLinkRefId: response.id,
      //     email: req.body.sharingEmail,
      //   };

      //   // Add the additional property "collectionName" to the payload
      //   payload.collectionName = "ShareviaEmail";

      //   // Call the insertItem function with the modified payload
      //   const emailresponse = await shareviaemail_insertitem(payload);

      //   let newpaymentlink = `${existingDoc.paymentLink.split("=")[0]}=${existingDoc._id
      //     }`;

      //   console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

      //   // let client = new SendMailClient({ url, token });

      //   let modifiedUserHTML = emailtemplate.replace(
      //     /{name}/g,
      //     req.body.sharingEmail
      //   );

      //   let fromEmail;

      //   let newapiKey;
      //   let newdomain;

      //   if (channelId == "1") {
      //     (newapiKey = process.env.LAWSIKHO_KEY),
      //       (newdomain = process.env.LAWSIKHO_DOMAIN),
      //       (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
      //     modifiedUserHTML = modifiedUserHTML.replace(
      //       /{logoImage}/g,
      //       "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/logo-red.png"
      //     );
      //   } else if (channelId == "2") {
      //     (newapiKey = process.env.SKILLARBITRAGE_KEY),
      //       (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
      //       (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
      //     modifiedUserHTML = modifiedUserHTML.replace(
      //       /{logoImage}/g,
      //       "https://admin.skillarbitra.ge/assets/uploads/media-library/06-pm-1701263078.png"
      //     );
      //   } else {
      //     (newapiKey = process.env.LAWSIKHO_KEY),
      //       (newdomain = process.env.LAWSIKHO_DOMAIN),
      //       (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
      //     modifiedUserHTML = modifiedUserHTML.replace(
      //       /{logoImage}/g,
      //       "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/logo-red.png"
      //     );
      //   }

      //   let mg;
      //   if (channelId == "1") {
      //     mg = mailgun({
      //       apiKey: newapiKey,
      //       domain: newdomain,
      //     });
      //   } else {
      //     mg = mailgun({
      //       apiKey: newapiKey,
      //       domain: newdomain,
      //       host: process.env.SKILLARBITRA_HOST,
      //     });
      //   }

      //   modifiedUserHTML = modifiedUserHTML.replace(
      //     /{Paymentlink}/g,
      //     newpaymentlink
      //   );

      //   modifiedUserHTML = modifiedUserHTML.replace(
      //     /{amount}/g,
      //     existingDoc.price.paymentToBeCollected
      //   );

      //   modifiedUserHTML = modifiedUserHTML.replace(
      //     /{linktoredirect}/g,
      //     newpaymentlink
      //   );

      //   const emailContent = {
      //     from: fromEmail,
      //     to: req.body.sharingEmail,
      //     subject: "Payment Link Share With You",
      //     text: "Generate & Share",
      //     html: modifiedUserHTML,
      //   };



      //   // Send email

      //   // Check the response and send appropriate status and message
      //   if (emailresponse.hasOwnProperty("ok")) {
      //     const data = await mg.messages().send(emailContent);
      //     console.log(data, "email sent successfully");

      //     res.status(201).json({
      //       message: "Sharing Info Created Successfully",
      //       emailresponse,
      //       token: jwtToken,
      //     });
      //   } else {
      //     res.status(400).json({
      //       message: "Sharing info Not Created",
      //       emailresponse: emailresponse.error.details,
      //     });
      //   }
      //   // res.status(201).json({
      //   //     message: "PaymentLink generated Successfully",
      //   //     response
      //   // });
      // } else {
      //   res.status(400).json({
      //     message: "PaymentLink not generated",
      //     response: response.error.details,
      //   });
      // }

      // Set token expiration based on paymentLinkExpireTime
      if (payload.paymentLinkExpireTime) {
        const expirationTimeInSeconds = Math.floor(
          (new Date(payload.paymentLinkExpireTime) - new Date()) / 1000
        );

        const jwttoken = jwt.sign(
          tokenPayload,
          process.env.TOKEN_SECRET_KEY,
          {
            expiresIn: expirationTimeInSeconds,
          }
        );

        let existingDoc = await DB.get(response.id);
        existingDoc.token = jwttoken;

        if (payload.channelInfo.name == "Skillarbitra") {
          existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
        }

        if (payload.channelInfo.name == "Lawsikho") {
          existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
        }
        // Save the updated document back to the database
        console.log("paymentLink", existingDoc.paymentLink);
        await DB.insert(existingDoc);
        console.log(existingDoc);

        const emailpayload = {
          paymentLinkRefId: response.id,
          email: req.body.sharingEmail,
        };

        // Add the additional property "collectionName" to the payload
        emailpayload.collectionName = "ShareviaEmail";

        // Call the insertItem function with the modified payload
        const emailresponse = await shareviaemail_insertitem(emailpayload);

        let newpaymentlink = `${existingDoc.paymentLink.split("=")[0]}=${existingDoc._id
          }`;

        console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

        // let client = new SendMailClient({ url, token });

        let fromEmail;

        let newapiKey;
        let newdomain;

        let modifiedUserHTML;
        

        if (channelId == "1") {
          (newapiKey = process.env.LAWSIKHO_KEY);
            (newdomain = process.env.LAWSIKHO_DOMAIN);
            (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);

            console.log(req.body.channelInfo.name,"req.body.channelInfo.name")
            
           
            modifiedUserHTML = emailtemplate.replace(
              /{name}/g,
              req.body.lead.name
            );
          modifiedUserHTML = modifiedUserHTML.replace(
            /{logoImage}/g,
            "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
          );
          modifiedUserHTML = modifiedUserHTML.replace(
            /{channelName}/g,
            req.body.channelInfo.name
          );
        } else if (channelId == "2") {
          (newapiKey = process.env.SKILLARBITRAGE_KEY);
            (newdomain = process.env.SKILLARBITRAGE_DOMAIN);
            (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
           
          modifiedUserHTML = skillArbiEmail.replace(/{name}/g, req.body.lead.name);
          modifiedUserHTML = modifiedUserHTML.replace(
            /{logoImage}/g,
            "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
          );
        
        } else {
          (newapiKey = process.env.LAWSIKHO_KEY);
            (newdomain = process.env.LAWSIKHO_DOMAIN);
            (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
           
            modifiedUserHTML = emailtemplate.replace(
              /{name}/g,
              req.body.lead.name
            );
          modifiedUserHTML = modifiedUserHTML.replace(
            /{logoImage}/g,
            "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
          );
          modifiedUserHTML = modifiedUserHTML.replace(
            /{channelName}/g,
            req.body.channelInfo.name
          );
        }

        let mg;
        if (channelId == "1") {
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

        modifiedUserHTML = modifiedUserHTML.replace(
          /{Paymentlink}/g,
          newpaymentlink
        );

        modifiedUserHTML = modifiedUserHTML.replace(
          /{amount}/g,
          existingDoc.price.paymentToBeCollected
        );

        modifiedUserHTML = modifiedUserHTML.replace(
          /{linktoredirect}/g,
          newpaymentlink
        );

        const emailContent = {
          from: fromEmail,
          to: req.body.sharingEmail,
          subject: "Payment Link Share With You",
          text: "Generate & Share",
          html: modifiedUserHTML,
        };

        // Send email

        // Check the response and send appropriate status and message
        if (emailresponse.hasOwnProperty("ok")) {
          const data = await mg.messages().send(emailContent);
          console.log(data, "email sent successfully");

          res.status(201).json({
            message: "Sharing Info Created Successfully",
            emailresponse,
            token: jwttoken,
          });
        } else {
          res.status(400).json({
            message: "Sharing info Not Created",
            emailresponse: emailresponse.error.details,
          });
        }
      } else {
        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

        let existingDoc = await DB.get(response.id);
        existingDoc.token = token;

        if (payload.channelInfo.name == "Skillarbitra") {
          existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
        }

        if (payload.channelInfo.name == "Lawsikho") {
          existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
        }
        // Save the updated document back to the database
        console.log("paymentLink", existingDoc.paymentLink);
        await DB.insert(existingDoc);
        // console.log(existingDoc);
        // return res.status(201).json({
        //   message: "PaymentLink generated Successfully",
        //   response,
        //   token,
        // });



        const emailpayload = {
          paymentLinkRefId: response.id,
          email: req.body.sharingEmail,
        };

        // Add the additional property "collectionName" to the payload
        emailpayload.collectionName = "ShareviaEmail";

        // Call the insertItem function with the modified payload
        const emailresponse = await shareviaemail_insertitem(emailpayload);

        let newpaymentlink = `${existingDoc.paymentLink.split("=")[0]}=${existingDoc._id
          }`;

        console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

        // let client = new SendMailClient({ url, token });

        let fromEmail;

        let newapiKey;
        let newdomain;

        let modifiedUserHTML;

        if (channelId == "1") {
          (newapiKey = process.env.LAWSIKHO_KEY);
            (newdomain = process.env.LAWSIKHO_DOMAIN);
            (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
            console.log(req.body.channelInfo.name,"req.body.channelInfo.name")
           
    
            modifiedUserHTML = emailtemplate.replace(
              /{name}/g,
              req.body.lead.name
            );
    
          modifiedUserHTML = modifiedUserHTML.replace(
            /{logoImage}/g,
            "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
          );
          modifiedUserHTML = modifiedUserHTML.replace(
            /{channelName}/g,
            req.body.channelInfo.name
          );
        } else if (channelId == "2") {
          (newapiKey = process.env.SKILLARBITRAGE_KEY),
            (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
            (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
          
          modifiedUserHTML = skillArbiEmail.replace(/{name}/g, req.body.lead.name);
          modifiedUserHTML = modifiedUserHTML.replace(
            /{logoImage}/g,
            "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
          );
         
        } else {
          (newapiKey = process.env.LAWSIKHO_KEY);
            (newdomain = process.env.LAWSIKHO_DOMAIN);
            (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
           
            modifiedUserHTML = emailtemplate.replace(
              /{name}/g,
              req.body.lead.name
            );
    
          modifiedUserHTML = modifiedUserHTML.replace(
            /{logoImage}/g,
            "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
          );
          modifiedUserHTML = modifiedUserHTML.replace(
            /{channelName}/g,
            req.body.channelInfo.name
          );
        }

        let mg;
        if (channelId == "1") {
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

        modifiedUserHTML = modifiedUserHTML.replace(
          /{Paymentlink}/g,
          newpaymentlink
        );

        modifiedUserHTML = modifiedUserHTML.replace(
          /{amount}/g,
          existingDoc.price.paymentToBeCollected
        );

        modifiedUserHTML = modifiedUserHTML.replace(
          /{linktoredirect}/g,
          newpaymentlink
        );

        const emailContent = {
          from: fromEmail,
          to: req.body.sharingEmail,
          subject: "Payment Link Share With You",
          text: "Generate & Share",
          html: modifiedUserHTML,
        };

        // Send email

        // Check the response and send appropriate status and message
        if (emailresponse.hasOwnProperty("ok")) {
          const data = await mg.messages().send(emailContent);
          console.log(data, "email sent successfully");

          res.status(201).json({
            message: "Sharing Info Created Successfully",
            emailresponse,
            token: token,
          });
        } else {
          res.status(400).json({
            message: "Sharing info Not Created",
            emailresponse: emailresponse.error.details,
          });
        }
      }
    } else {
      payload.approvalStatus = "pending";

      payload.currentStatus = ["generated"];
      console.log("token log")
      payload.statusChangeHistory = [
        {
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
          },
        },
      ];

      // Link is generated by
      payload.linkGeneratedBy = {
        refId: userInfo.userInfo?.user_id,
        name: userInfo.userInfo?.name,
        email: userInfo.userInfo?.email,
        // phone: userInfo.userInfo.phone,
        phone: {
          countryCode: userInfo.userInfo?.countryCode || 91,
          phoneNo: userInfo.userInfo?.phone,
          contactedNumber: `${userInfo.userInfo?.countryCode || 91 + userInfo.userInfo?.phone}`
        }
      };

      // Call the insertItem function with the modified payload
      const response = await generated_payment_link_validation_insertItem(
        payload
      );



      // Check the response and send appropriate status and message
      if (response.hasOwnProperty("ok")) {
        // Generate JWT token
        // payload.id = response.id

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
          id: response.id,
        };

        // Set token expiration based on paymentLinkExpireTime
        if (payload.paymentLinkExpireTime) {
          const expirationTimeInSeconds = Math.floor(
            (new Date(payload.paymentLinkExpireTime) - new Date()) / 1000
          );

          const jwttoken = jwt.sign(
            tokenPayload,
            process.env.TOKEN_SECRET_KEY,
            {
              expiresIn: expirationTimeInSeconds,
            }
          );

          let existingDoc = await DB.get(response.id);
          existingDoc.token = jwttoken;

          if (payload.channelInfo.name == "Skillarbitra") {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
          }

          if (payload.channelInfo.name == "Lawsikho") {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
          }
          // Save the updated document back to the database
          console.log("paymentLink", existingDoc.paymentLink);
          await DB.insert(existingDoc);
          console.log(existingDoc);

          const emailpayload = {
            paymentLinkRefId: response.id,
            email: req.body.sharingEmail,
          };

          // Add the additional property "collectionName" to the payload
          emailpayload.collectionName = "ShareviaEmail";

          // Call the insertItem function with the modified payload
          const emailresponse = await shareviaemail_insertitem(emailpayload);

          let newpaymentlink = `${existingDoc.paymentLink.split("=")[0]}=${existingDoc._id
            }`;

          console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

          // let client = new SendMailClient({ url, token });

          let fromEmail;

          let newapiKey;
          let newdomain;

          let modifiedUserHTML;

          if (channelId == "1") {
            (newapiKey = process.env.LAWSIKHO_KEY),
              (newdomain = process.env.LAWSIKHO_DOMAIN),
              (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
              console.log(req.body.channelInfo.name,"req.body.channelInfo.name")
              
              modifiedUserHTML = emailtemplate.replace(
                /{name}/g,
                req.body.lead.name
              );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{logoImage}/g,
              "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
            );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{channelName}/g,
              req.body.channelInfo.name
            );
          } else if (channelId == "2") {
            (newapiKey = process.env.SKILLARBITRAGE_KEY),
              (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
              (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
             
            modifiedUserHTML = skillArbiEmail.replace(/{name}/g, req.body.lead.name);
            modifiedUserHTML = modifiedUserHTML.replace(
              /{logoImage}/g,
              "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
            );
          
          } else {
            (newapiKey = process.env.LAWSIKHO_KEY),
              (newdomain = process.env.LAWSIKHO_DOMAIN),
              (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
             
              modifiedUserHTML = emailtemplate.replace(
                /{name}/g,
                req.body.lead.name
              );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{logoImage}/g,
              "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
            );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{channelName}/g,
              req.body.channelInfo.name
            );
          }

          let mg;
          if (channelId == "1") {
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

          modifiedUserHTML = modifiedUserHTML.replace(
            /{Paymentlink}/g,
            newpaymentlink
          );

          modifiedUserHTML = modifiedUserHTML.replace(
            /{amount}/g,
            existingDoc.price.paymentToBeCollected
          );

          modifiedUserHTML = modifiedUserHTML.replace(
            /{linktoredirect}/g,
            newpaymentlink
          );

          const emailContent = {
            from: fromEmail,
            to: req.body.sharingEmail,
            subject: "Payment Link Share With You",
            text: "Generate & Share",
            html: modifiedUserHTML,
          };

          // Send email

          // Check the response and send appropriate status and message
          if (emailresponse.hasOwnProperty("ok")) {
            const data = await mg.messages().send(emailContent);
            console.log(data, "email sent successfully");

            res.status(201).json({
              message: "Sharing Info Created Successfully",
              emailresponse,
              token: jwttoken,
            });
          } else {
            res.status(400).json({
              message: "Sharing info Not Created",
              emailresponse: emailresponse.error.details,
            });
          }
        } else {
          const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY);

          let existingDoc = await DB.get(response.id);
          existingDoc.token = token;

          if (payload.channelInfo.name == "Skillarbitra") {
            existingDoc.paymentLink = `${process.env.SKILLARBITRA}/payment?token=${token}`;
          }

          if (payload.channelInfo.name == "Lawsikho") {
            existingDoc.paymentLink = `${process.env.LAWSIKHO}/payment?token=${token}`;
          }
          // Save the updated document back to the database
          console.log("paymentLink", existingDoc.paymentLink);
          await DB.insert(existingDoc);
          // console.log(existingDoc);
          // return res.status(201).json({
          //   message: "PaymentLink generated Successfully",
          //   response,
          //   token,
          // });



          const emailpayload = {
            paymentLinkRefId: response.id,
            email: req.body.sharingEmail,
          };

          // Add the additional property "collectionName" to the payload
          emailpayload.collectionName = "ShareviaEmail";

          // Call the insertItem function with the modified payload
          const emailresponse = await shareviaemail_insertitem(emailpayload);

          let newpaymentlink = `${existingDoc.paymentLink.split("=")[0]}=${existingDoc._id
            }`;

          console.log(newpaymentlink, "sssssssssssssssssssssssssssss");

          // let client = new SendMailClient({ url, token });

          let fromEmail;

          let newapiKey;
          let newdomain;

          let modifiedUserHTML;

          if (channelId == "1") {
            (newapiKey = process.env.LAWSIKHO_KEY),
              (newdomain = process.env.LAWSIKHO_DOMAIN),
              (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
              console.log(req.body.channelInfo.name,"req.body.channelInfo.name")
            
              modifiedUserHTML = emailtemplate.replace(
                /{name}/g,
                req.body.lead.name
              );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{logoImage}/g,
              "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
            );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{channelName}/g,
              req.body.channelInfo.name
            );
          } else if (channelId == "2") {
            (newapiKey = process.env.SKILLARBITRAGE_KEY),
              (newdomain = process.env.SKILLARBITRAGE_DOMAIN),
              (fromEmail = process.env.EMAIL_FROM_SKILLARBITRAGE);
              
              modifiedUserHTML = skillArbiEmail.replace(/{name}/g, req.body.lead.name);
            modifiedUserHTML = modifiedUserHTML.replace(
              /{logoImage}/g,
              "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/skill-new.jpeg"
            );
          
          } else {
            (newapiKey = process.env.LAWSIKHO_KEY),
              (newdomain = process.env.LAWSIKHO_DOMAIN),
              (fromEmail = process.env.EMAIL_FROM_LAWSIKHO);
              
              modifiedUserHTML = emailtemplate.replace(
                /{name}/g,
                req.body.lead.name
              );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{logoImage}/g,
              "https://assignment-portal.s3.ap-south-1.amazonaws.com/logo/lawsikho-new.jpeg"
            );
            modifiedUserHTML = modifiedUserHTML.replace(
              /{channelName}/g,
              req.body.channelInfo.name
            );
          }

          let mg;
          if (channelId == "1") {
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

          modifiedUserHTML = modifiedUserHTML.replace(
            /{Paymentlink}/g,
            newpaymentlink
          );

          modifiedUserHTML = modifiedUserHTML.replace(
            /{amount}/g,
            existingDoc.price.paymentToBeCollected
          );

          modifiedUserHTML = modifiedUserHTML.replace(
            /{linktoredirect}/g,
            newpaymentlink
          );

          const emailContent = {
            from: fromEmail,
            to: req.body.sharingEmail,
            subject: "Payment Link Share With You",
            text: "Generate & Share",
            html: modifiedUserHTML,
          };

          // Send email

          // Check the response and send appropriate status and message
          if (emailresponse.hasOwnProperty("ok")) {
            const data = await mg.messages().send(emailContent);
            console.log(data, "email sent successfully");

            res.status(201).json({
              message: "Sharing Info Created Successfully",
              emailresponse,
              token: token,
            });
          } else {
            res.status(400).json({
              message: "Sharing info Not Created",
              emailresponse: emailresponse.error.details,
            });
          }
        }
      } else {
        res.status(400).json({
          message: "PaymentLink not generated",
          response: response.error.details,
        });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  Shareviaemail_share,
  Generate_and_share,
};
