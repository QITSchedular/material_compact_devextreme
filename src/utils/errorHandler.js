async function errorHandler(errorsData) {
  if (errorsData && errorsData.errors) {
    const errorMessages = [];
    for (const key in errorsData.errors) {
      if (Array.isArray(errorsData.errors[key])) {
        if (key == "payload") {
          await errorMessages.push(errorsData.title);
          break;
        } else {
          await errorMessages.push(errorsData.errors[key][0]);
        }
      }
    }
    return errorMessages;
  }

  return [];
}

// with payload:

// const jsonData = {
//   type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
//   title: "One or more validation errors occurred.",
//   status: 400,
//   traceId: "00-16fcee61d28c4c3a952ab4a6f61565ec-a27fe29bb01e8176-00",
//   errors: {
//     payload: ["The payload field is required."],
//     "$.uomEntry": [
//       "The JSON value could not be converted to System.Int32. Path: $.uomEntry | LineNumber: 5 | BytePositionInLine: 43.",
//     ],
//   },
// };

// //without payload:
// const jsonData2 = {
//   type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
//   title: "One or more validation errors occurred.",
//   status: 400,
//   traceId: "00-fe6d911a9667048d07af5d078dde27a0-0ace3f8e53f05198-00",
//   errors: {
//     ItemCode: ["The ItemCode field is required."],
//   },
// };

export const checkErrorMessages = async (errorPayload) => {
  const statusObj = {
    statusCode: "",
    statusMsg: "",
    hasError: false,
  };

  if (errorPayload.statusCode === "200") {
    statusObj.statusCode = "200";
    statusObj.statusMsg = errorPayload.statusMsg;
    statusObj.hasError = false;
    console.log("Items is saved successfully");
    return statusObj;
  } else if (
    errorPayload.statusCode === "400" &&
    errorPayload.statusMsg.length > 0
  ) {
    statusObj.statusCode = "200";
    statusObj.statusMsg = errorPayload.statusMsg;
    statusObj.hasError = true;
    return statusObj;
  } else {
    const errorMessages = await errorHandler(errorPayload);
    await errorMessages.forEach((message) => {
      if (message) {
        statusObj.statusCode = "400";
        statusObj.statusMsg = message;
        statusObj.hasError = true;
        console.log(message);

        return statusObj;
      }
    });
  }
};
