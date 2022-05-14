import React from "react";
import "./styles/style.css";
function PredictionTournamentDetail() {
  return (
    <>
    <div className="popup__prediction">
      <h2>Dự đoán</h2>
      <div className="popup__prediction__wrap">
      <h3 className="teamA__prediction">Đội A</h3>
      <input type="number"/>
      <div className="line"></div>
      <input type="number"/>
      <h3 className="teamA__prediction">Đội B</h3>
      </div>
      <button>Xác nhận</button>
    </div>

        <div className="teamdetail__content schedule__tour prediction">
        <div className="wrap__table">
              <table className="schedule__table">
                <tr>
                  <th colSpan={5}>Dự đoán</th>
                </tr>
                <tr>
                  <td>20-11-2021 12h30</td>
                  <td>
                    Đội A
                    <img
                      src="/assets/img/homepage/banner1.jpg"
                      alt="gallery_item"
                    />
                  </td>
                  <td>
                    <span className="score">1</span>
                    <span className="score"> - </span>
                    <span className="score">0</span>
                  </td>
                  <td>
                    <img
                      src="/assets/img/homepage/banner1.jpg"
                      alt="gallery_item"
                    />
                    Đội B{" "}
                  </td>
                  <td><button className="btnPrediction">Dự đoán</button></td>
                </tr>
                <tr>
                  <td>20-11-2021 12h30</td>
                  <td>
                    Đội A
                    <img
                      src="/assets/img/homepage/banner1.jpg"
                      alt="gallery_item"
                    />
                  </td>
                  <td>
                    <span className="score">1</span>
                    <span className="score"> - </span>
                    <span className="score">0</span>
                  </td>
                  <td>
                    <img
                      src="/assets/img/homepage/banner1.jpg"
                      alt="gallery_item"
                    />
                    Đội B{" "}
                  </td>
                  <td><button className="btnPrediction">Dự đoán</button></td>
                </tr>
                <tr>
                  <td>20-11-2021 11h30</td>
                  <td>
                    Đội A
                    <img
                      src="/assets/img/homepage/banner1.jpg"
                      alt="gallery_item"
                    />
                  </td>
                  <td>
                    <span className="score">0</span>
                    <span className="score"> - </span>
                    <span className="score">0</span>
                  </td>
                  <td>
                    <img
                      src="/assets/img/homepage/banner1.jpg"
                      alt="gallery_item"
                    />
                    Đội B{" "}
                  </td>
                  <td><button className="btnPrediction">Dự đoán</button></td>
                </tr>
              </table>
            </div>
        </div>
    </>
  );
}

export default PredictionTournamentDetail;
