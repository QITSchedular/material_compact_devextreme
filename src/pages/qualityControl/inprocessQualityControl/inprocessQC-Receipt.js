import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react";
import { QtcDataGrid } from "../../../components";
import { useNavigate } from "react-router-dom";

// export const customers = [
//   {
//     ID: 1,
//     CompanyName: "Super Mart of the West",
//     Address: "702 SW 8th Street",
//     City: "Bentonville",
//     State: "Arkansas",
//     Zipcode: 72716,
//     Phone: "(800) 555-2797",
//     Fax: "(800) 555-2171",
//     Website: "http://www.nowebsitesupermart.com",
//   },
//   {
//     ID: 2,
//     CompanyName: "Electronics Depot",
//     Address: "2455 Paces Ferry Road NW",
//     City: "Atlanta",
//     State: "Georgia",
//     Zipcode: 30339,
//     Phone: "(800) 595-3232",
//     Fax: "(800) 595-3231",
//     Website: "http://www.nowebsitedepot.com",
//   },
//   {
//     ID: 3,
//     CompanyName: "K&S Music",
//     Address: "1000 Nicllet Mall",
//     City: "Minneapolis",
//     State: "Minnesota",
//     Zipcode: 55403,
//     Phone: "(612) 304-6073",
//     Fax: "(612) 304-6074",
//     Website: "http://www.nowebsitemusic.com",
//   },
//   {
//     ID: 4,
//     CompanyName: "Tom's Club",
//     Address: "999 Lake Drive",
//     City: "Issaquah",
//     State: "Washington",
//     Zipcode: 98027,
//     Phone: "(800) 955-2292",
//     Fax: "(800) 955-2293",
//     Website: "http://www.nowebsitetomsclub.com",
//   },
//   {
//     ID: 5,
//     CompanyName: "E-Mart",
//     Address: "3333 Beverly Rd",
//     City: "Hoffman Estates",
//     State: "Illinois",
//     Zipcode: 60179,
//     Phone: "(847) 286-2500",
//     Fax: "(847) 286-2501",
//     Website: "http://www.nowebsiteemart.com",
//   },
//   {
//     ID: 6,
//     CompanyName: "Walters",
//     Address: "200 Wilmot Rd",
//     City: "Deerfield",
//     State: "Illinois",
//     Zipcode: 60015,
//     Phone: "(847) 940-2500",
//     Fax: "(847) 940-2501",
//     Website: "http://www.nowebsitewalters.com",
//   },
//   {
//     ID: 7,
//     CompanyName: "StereoShack",
//     Address: "400 Commerce S",
//     City: "Fort Worth",
//     State: "Texas",
//     Zipcode: 76102,
//     Phone: "(817) 820-0741",
//     Fax: "(817) 820-0742",
//     Website: "http://www.nowebsiteshack.com",
//   },
//   {
//     ID: 8,
//     CompanyName: "Circuit Town",
//     Address: "2200 Kensington Court",
//     City: "Oak Brook",
//     State: "Illinois",
//     Zipcode: 60523,
//     Phone: "(800) 955-2929",
//     Fax: "(800) 955-9392",
//     Website: "http://www.nowebsitecircuittown.com",
//   },
//   {
//     ID: 9,
//     CompanyName: "Premier Buy",
//     Address: "7601 Penn Avenue South",
//     City: "Richfield",
//     State: "Minnesota",
//     Zipcode: 55423,
//     Phone: "(612) 291-1000",
//     Fax: "(612) 291-2001",
//     Website: "http://www.nowebsitepremierbuy.com",
//   },
//   {
//     ID: 10,
//     CompanyName: "ElectrixMax",
//     Address: "263 Shuman Blvd",
//     City: "Naperville",
//     State: "Illinois",
//     Zipcode: 60563,
//     Phone: "(630) 438-7800",
//     Fax: "(630) 438-7801",
//     Website: "http://www.nowebsiteelectrixmax.com",
//   },
//   {
//     ID: 11,
//     CompanyName: "Video Emporium",
//     Address: "1201 Elm Street",
//     City: "Dallas",
//     State: "Texas",
//     Zipcode: 75270,
//     Phone: "(214) 854-3000",
//     Fax: "(214) 854-3001",
//     Website: "http://www.nowebsitevideoemporium.com",
//   },
//   {
//     ID: 12,
//     CompanyName: "Screen Shop",
//     Address: "1000 Lowes Blvd",
//     City: "Mooresville",
//     State: "North Carolina",
//     Zipcode: 28117,
//     Phone: "(800) 445-6937",
//     Fax: "(800) 445-6938",
//     Website: "http://www.nowebsitescreenshop.com",
//   },
// ];

const columns = [
    {
        caption: "Vendor Code",
        field: "cardCode",
    },
    {
        caption: "Vendor Ref No.",
        field: "cardCode",
    },
    {
        caption: "Vendor Name",
        field: "cardName",
    },
    {
        caption: "Doc Series",
        field: "series",
    },
    {
        caption: "Doc No.",
        field: "docNum",
    },
    {
        caption: "Doc Date",
        field: "docDate",
    },
    {
        caption: "Post Date",
        field: "postDate",
    },
    // {
    //   caption: "Project",
    //   field: "project",
    // },
    // {
    //   caption: "Remark",
    //   field: "project",
    // },
    {
        caption: "Doc Entry",
        field: "docEntry",
    },
];

var customers = [];

function InprocessQCReceipt({ IQCList2 }) {
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const handleProceed = (headerQRCodeID, docEntry) => {
        return navigate(
            `/qualityControl/inprocessQualityControl/InprocessQcScanItemsPage/${headerQRCodeID}/${docEntry}`
        );
    };

    const findObjectByUniqueCode = (uniqueCode) => {
        for (const obj of IQCList2) {
            if (obj.docEntry === uniqueCode) {
                return obj; // Return the object if the unique code matches
            }
        }
        return null; // Return null if no object with the unique code is found
    };

    const handleShowRealtiveDataGrid = (qrCode) => {
        setData((prevData) => ({
            ...prevData,
            [qrCode]: !prevData[qrCode], // Toggle the value
        }));
        customers = findObjectByUniqueCode(qrCode);
        // console.log("data",response);
    };


    useEffect(() => {
        // Simulating fetching data from an API
        const fetchData = async () => {
            console.log("IQCList2**", IQCList2);
            try {
                const newData = {};
                [...IQCList2].forEach((item) => {
                    var qrCode = item["docEntry"];
                    console.log(item["docEntry"])
                    newData[qrCode] = false; // Set initial value to false
                });
                setData(newData);
                // setData(jsonData); // Store the array of objects in the state
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Call the function to fetch and update data
    }, [IQCList2]); // Empty dependency array means this effect runs once after initial render

    return (
        <>
            {IQCList2.size > 0 && (
                <div className="po-list-section">
                    {[...IQCList2].map((item, index) => (
                        <div key={index} className="single-po">
                            <div className="single-po1">
                                <div className="single-po-delete">
                                    <Button icon="trash"></Button>
                                </div>
                                <div className="single-po-name">
                                    <span className="po-name">{item["headerQRCodeID"]}</span>
                                    <Button
                                        icon="custom-chevron-down-icon"
                                        onClick={() => handleShowRealtiveDataGrid(item["docEntry"])}
                                    ></Button>
                                </div>
                                <div className="single-po-proceed">
                                    <Button
                                        text="Proceed"
                                        onClick={() => handleProceed(item["headerQRCodeID"], item["docEntry"])}
                                    ></Button>
                                </div>
                            </div>
                            <div className="single-po2">
                                {data[item["docEntry"]] && (
                                    <div className="data-grid-drop-down">
                                        <QtcDataGrid columns={columns} Data={[item]} keyExpr="docEntry" />
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default InprocessQCReceipt;
