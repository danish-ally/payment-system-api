const axios = require("axios");
const DB = require("../../../common/couchdb");
const country_code_data = require("../../../common/utils/CountryCode.json")

const getCourseByChannel = async (req, res) => {
  try {
    console.log(req.params);
    const channelId = req.params?.channelId;
    const base_url = process.env.BASE_URL_GATEWAY;
    const response = await axios.get(`${base_url}/api/${channelId}/course`);
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getPackageByChannel = async (req, res) => {
  try {
    const channelId = req.params?.channelId;
    const base_url = process.env.BASE_URL_GATEWAY;
    const response = await axios.get(`${base_url}/api/${channelId}/library`);
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getBootcampByChannel = async (req, res) => {
  try {
    const channelId = req.params?.channelId;
    const base_url = process.env.BASE_URL_GATEWAY;
    const response = await axios.get(`${base_url}/api/${channelId}/offer`);
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getSalesCallerList = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    const base_url = process.env.BASE_URL_GATEWAY;
    const channelId = req.params?.channelId;
    const status = req.query?.status;
    let userCategory;
    if (channelId == 1) {
      userCategory = process.env.LSuserCategory;
    } else {
      userCategory = process.env.SAuserCategory;
    }

    console.log(`${base_url}/api/usersapi/get_users/${channelId}?status=${status}&userCategory=${userCategory}`)
    const response = await axios.get(`${base_url}/api/usersapi/get_users/${channelId}?status=${status}&userCategory=${userCategory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    // console.log(data)
    

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getPaymentType = async (req, res) => {
  try {
    const token = req.headers?.authorization;
    const base_url = process.env.BASE_URL_GATEWAY;
    const response = await axios.get(`${base_url}/api/paymentInstallmentType`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getCoursePlan = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const channelId = req.params?.channelId;
    const token = req.headers?.authorization;

    const base_url = process.env.BASE_URL_GATEWAY;

    const response = await axios.get(
      `${base_url}/api/${channelId}/coursePlan/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getPackagePlan = async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const channelId = req.params?.channelId;
    const token = req.headers?.authorization;

    const base_url = process.env.BASE_URL_GATEWAY;

    const response = await axios.get(
      `${base_url}/api/${channelId}/libraryPlan/${packageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getCoursePrice = async (req, res) => {
  try {
    const { channelid, courseId, coursePlanId, courseType } = req.query;

    const token = req.headers?.authorization;

    const base_url = process.env.BASE_URL_GATEWAY;

    const response = await axios.get(
      `${base_url}/api/paymentSystemapi/get_coursePrice/${channelid}/${courseId}/${coursePlanId}/${courseType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    // console.log(data)

    return res.json(data);
  } catch (error) {
    if (error.response?.status == 401) {
      return res.status(401).json({
        message: error.message,
        error: true,
        err: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    }
  }
};

const getCountryCode = async (req, res) => {
  try {
    
    // console.log(data)

    return res.json(
      {
        error:false,
        country_codes:country_code_data,
        message:"got country code successfully"
      }
    );
  } catch (error) {
    
      return res.status(500).json({
        message: "Internal server error",
        error: true,
        err: error.message,
      });
    
  }
};

const sendOrderDetails = async (req, res) => {
  try {
    const { channelid, channelRqParams } = req.body;
    const q = {
      selector: {
        collectionName: { $eq: "Channels" },
        name: { $eq: channelid },
      },
      fields: ["domain", "apiUrl"],
    };
    const channelDetails = await DB.find(q);
    const apiUrl = channelDetails.docs[0].apiUrl;
    const domain = channelDetails.docs[0].domain;
    console.log("apiUrl:", apiUrl, domain);
    let data = new FormData();
    data.append("order_date", channelRqParams.order_date);
    if (channelRqParams.course_id)
      data.append("course_id", channelRqParams.course_id);
    data.append("offer_id", channelRqParams.offer_id);
    if (channelRqParams.course_plan_id)
      data.append("course_plan_id", channelRqParams.course_plan_id);
    data.append("amount", channelRqParams.amount);
    data.append("payment_status", channelRqParams.payment_status);
    data.append("status", channelRqParams.status);
    data.append("user_source", channelRqParams.user_source);
    data.append("user_name", channelRqParams.user_name);
    data.append("user_email", channelRqParams.user_email);
    data.append("country_code", channelRqParams.country_code);
    data.append("user_phone", channelRqParams.user_phone);
    data.append("order_type", channelRqParams.order_type);
    data.append("cash_comment", channelRqParams.cash_comment);

    console.log(data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiUrl}/revenueapi/add_order`,
      data: data,
    };
    const response = await axios.request(config);
    const result = response.data;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      err: error.message,
    });
  }
};
module.exports = {
  getCourseByChannel,
  getPackageByChannel,
  getBootcampByChannel,
  getSalesCallerList,
  getPaymentType,
  getCoursePlan,
  getPackagePlan,
  getCoursePrice,
  sendOrderDetails,
  getCountryCode,
};
