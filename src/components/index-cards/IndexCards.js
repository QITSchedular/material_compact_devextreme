import React from "react";
import { navigation } from "../../app-navigation";
import Card from "../../components/card/Card";

export default function IndexCards({ path }) {
  let navobj = {},
    arr = [];

  navigation.forEach((value1, key) => {
    Object.keys(value1).forEach((value2, key) => {
      if (value2 === "items") {
        arr = value1[value2];
        navobj[value1["path"]] = arr;
      }
    });
  });

    return (
        <React.Fragment>
            <div className="grid-container">
                {
                    navobj[path].map((value, key) => (
                        <>
                            <Card
                                title={value['text']}
                                description={"Here is the description for the particular"}
                                icon={value['icon']}
                                path={value['path']}
                            />
                        </>
                    ))}
            </div>
        </React.Fragment>
    );

}
