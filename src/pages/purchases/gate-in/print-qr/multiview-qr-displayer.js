import React, { useEffect, useState, useRef } from "react";
import QRCode from 'qrcode.react';
import { Button } from "devextreme-react/button";
import "./qr-displayer-styles.scss";
import qrcode from "qrcode";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const QrViewBox = ({ data, slideDirection }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data && data.detailQRCodeID) {
      qrcode.toCanvas(canvasRef.current, data.detailQRCodeID, (error) => {
        if (error) {
          console.error("Error while genratting  QR code:", error);
        }
      });
    }
  }, [data]);

  return (
    <div className="qr-view-box">
      <div className={`content-wrapper responsive-paddings-sm ${slideDirection}`}>
        <div className="content__header">

          <div className="header---description">
            <span className="header__title">Scan The QR Code</span>
            <span className="header__supporting--text">
              Place the scanner on the QR code to detect
            </span>
          </div>
        </div>

        <div className="vertical-layout">
          <div className={`qr__displayer ${slideDirection}`}>
            <canvas ref={canvasRef} width={60} height={60}></canvas>
          </div>

        </div>
        <div className="qr__string--displayer">{data && data.detailQRCodeID}</div>

      </div>
    </div>
  );
};


const Multiviewdisplayer = ({ handleClose, multipleQrCodes }) => {
  const [qrCodeImages, setQrCodeImages] = useState([]);
  const [slideDirection, setSlideDirection] = useState(null);
  const [slider, setSlider] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const generateQrImages = () => {
    const images = [];
    const qrImagePromises = [];

    multipleQrCodes.forEach((data) => {
      if (data && data.detailQRCodeID) {
        qrImagePromises.push(
          new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            qrcode.toCanvas(canvas, data.detailQRCodeID, (error) => {
              if (error) {
                console.error("Error generating QR code:", error);
                resolve(null);
              } else {
                images.push(canvas.toDataURL("image/png"));
                resolve();
              }
            });
          })
        );
      }
    });

    Promise.all(qrImagePromises).then(() => {
      const printImages = images
        .filter((image) => image !== null)
        .map(
          (imageData) =>
            '<div style="page-break-after: always;"><img src="' +
            imageData +
            '" width="150" height="150"></div>'
        )
        .join("");

      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.open();
      printWindow.document.write('<html><body>' + printImages + "</body></html");
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    });
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
  };

  const goToPrev = () => {
    if (currentSlide > 0) {
      slider && slider.slickPrev();
    }
  };

  const goToNext = () => {
    if (currentSlide < multipleQrCodes.length - 1) {
      slider && slider.slickNext();
    }
  };

  return (
    <>
      <div className="multiview-displayer-horizontal">
        <div className="header---closer">
          <Button icon="close" width={35} height={35} onClick={handleClose} />
        </div>
        <div className="middle-button-container">
          <Button
            type="default"
            stylingMode="outlined"
            icon="chevronprev"
            onClick={goToPrev}
            disabled={currentSlide === 0}
            
          />
          <Button
            icon="chevronnext"
            type="default"
            stylingMode="outlined"
            onClick={goToNext}
            disabled={currentSlide === multipleQrCodes.length - 1}
            className="right-button"
          />
        </div>

          <Slider {...settings} ref={(slider) => setSlider(slider)}>
            {multipleQrCodes.map((data, index) => (
              <QrViewBox key={index} data={data} slideDirection={slideDirection} />
            ))}
          </Slider>
         

        <Button
          text="Print QR"
          type="default"
          height={32}
          className="item-btn print-qr"
          onClick={generateQrImages}
        />
      </div>
    </>
  );
};

export default Multiviewdisplayer;

