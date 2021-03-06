import React, { useState, useEffect } from "react";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
export default function ModalChangeDateInSchedule(props) {
  const {
    hideShow,
    setHideShow,
    matchCurrent,
    setMatchCurrent,
    startDate,
    endDate,
    onChangHandle,
    dateUpdate,
    setDateUpdate,
    updateDateInMatch,
    teamInUpdate,
    indexSchedule
  } = props;
  
  const [newStart, setNewStart] = useState(null);
  useEffect(() => {
    
    // console.log(typeof matchCurrent.matchDate)
    // console.log(typeof new Date().toJSON())
    const dateUpdate = new Date(matchCurrent.matchDate);
    const dateCurrent = new Date();
    if (matchCurrent.matchDate !== null && +dateCurrent > +dateUpdate) {
      setNewStart(dateCurrent.toJSON());
      setDateUpdate(
        matchCurrent != null && matchCurrent.matchDate != null
          ? matchCurrent.matchDate
          : dateCurrent.toJSON()
      );
    } else {
      setNewStart(startDate);
      setDateUpdate(
        matchCurrent != null ? matchCurrent.matchDate : dateCurrent.toJSON()
      );
      //setDateUpdate(matchCurrent != null &&  matchCurrent.matchDate != null ? matchCurrent.matchDate : startDate);
    }
    //console.log(setNewStart(new Date().toJSON().split('T')[0] + "" + new Date().toJSON().split('T')[1]))
    // const time = startDate.split(" ");
    // const date =
    //   new Date().getDate() < 10
    //     ? "0" + new Date().getDate()
    //     : new Date().getDate();
    // const month =
    //   new Date().getMonth() + 1 < 10
    //     ? "0" + (new Date().getMonth() + 1)
    //     : new Date().getMonth() + 1;
    //     const conditon = time[0];
    //     let dateData = new Date(conditon);
    //     let dateCurrent = new Date(
    //       month + "/" + date   + "/" + time[0].split("/")[2]
    //     );

    // if (+dateCurrent > +dateData) {
    //   let newTime =
    //     time[0].split("-")[0] + "-" + month + "-" + date + "T" + time[1];
    //   //console.log(time);
    //   setNewStart(newTime);
    //   setDateUpdate(matchCurrent != null &&  matchCurrent.matchDate != null ? matchCurrent.matchDate : newTime);
    //   //console.log(newTime);
    // } else {
    //   setNewStart(startDate);
    //   setDateUpdate(matchCurrent != null &&  matchCurrent.matchDate != null ? matchCurrent.matchDate : startDate);
    // }
  }, [matchCurrent.id]);
  const changeMinDate = (data) => {
    
    if (data !== null) {
      const splitDateTime = data.split(" ");
      return (
        splitDateTime[0].split("-")[0] +
        " " +
        7 +
        ":" +
        splitDateTime[1].split(":")[1]
      );
    }
  };
  const changeDate = (data, type) => {
    let splitDateTime = null;
    if (type === "maxDate") {
      console.log(data);
      const maxTimeSlip = data.split(" ");
      const newDate = new Date(
        maxTimeSlip[0].split("/")[0] +
          "-" +
          maxTimeSlip[0].split("/")[1] +
          "-" +
          maxTimeSlip[0].split("/")[2] +
          " " +
          maxTimeSlip[1].split(":")[0] +
          ":" +
          maxTimeSlip[1].split(":")[1]
      ).toJSON();
      splitDateTime = newDate.split("T");

      return (
        splitDateTime[0].split("-")[1] +
        "-" +
        splitDateTime[0].split("-")[2] +
        "-" +
        
        splitDateTime[0].split("-")[0] +
        " " +
        23 +
        ":" +
        splitDateTime[1].split(":")[1]
      );
    } else {
      splitDateTime = data.split("T");
      const numberHour =
      +splitDateTime[1].split(":")[0] + 7 > 24
        ? +splitDateTime[1].split(":")[0] + 7 - 24
        : +splitDateTime[1].split(":")[0] + 7;
      return (
        splitDateTime[0].split("-")[2] +
        "-" +
        splitDateTime[0].split("-")[1] +
        "-" +
        splitDateTime[0].split("-")[0] +
        " " +
        numberHour +
        ":" +
        splitDateTime[1].split(":")[1]
      );
    }
  };
  return (
    <div
      id="exampleModal"
      className={hideShow ? "popup__player active" : "popup__player"}
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Thay ?????i ng??y gi??? tr???n ?????u
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setHideShow(false);
                setMatchCurrent(null);
                setDateUpdate(null);
              }}
            ></button>
          </div>
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {teamInUpdate}
          </p>
          {matchCurrent != null ? (
            matchCurrent.matchDate != null ? (
              <div
                style={{
                  fontWeight: 700,
                  lineHeight: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
                class="modal-body"
              >
                Ng??y gi??? hi???n t???i c???a tr???n ?????u:{" "}
                {changeDate(matchCurrent.matchDate)}{" "}
                <p>S???a ng??y gi??? thi ?????u:</p>
                {/* <input
                  style={{
                    width: "50%",
                    padding: "10px",
                  }}
                  name="dateUpdate"
                  value={dateUpdate}
                  onChange={onChangHandle}
                  type="datetime-local"
                  min={newStart}
                  max={endDate}
                /> */}
                <DateTimePickerComponent
                  id="datetimepicker"
                  placeholder="Ch???nh s???a ng??y gi??? b???t ?????u tr???n ?????u"
                  name="dateUpdate"
                  value={dateUpdate}
                  format="dd-MM-yyy HH:mm"
                  onChange={onChangHandle}
                  min={changeMinDate(newStart)}
                  max={changeDate(endDate, "maxDate")}
                />
              </div>
            ) : (
              <div
                style={{
                  fontWeight: 700,
                  color: "red",
                  display: "flex",
                  flexDirection: "column",
                }}
                class="modal-body"
              >
                <p
                  style={{
                    marginBottom: 20,
                  }}
                >
                  Hi???n t???i tr???n ?????u ch??a c?? ng??y gi??? di???n ra h??y c???p nh???t n??
                </p>
                <DateTimePickerComponent
                  id="datetimepicker"
                  name="dateUpdate"
                  value={dateUpdate}
                  placeholder="Ng??y gi??? b???t ?????u tr???n ?????u"
                  format="dd-MM-yyy HH:mm"
                  onChange={onChangHandle}
                  min={changeMinDate(newStart)}
                  max={changeDate(endDate, "maxDate")}
                />
                {/* <input
                  style={{
                    width: "50%",
                    padding: "10px",
                  }}
                  name="dateUpdate"
                  value={dateUpdate}
                  onChange={onChangHandle}
                  type="datetime-local"
                  min={newStart}
                  max={endDate}
                /> */}
              </div>
            )
          ) : null}

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => {
                setHideShow(false);
                setMatchCurrent(null);
                setDateUpdate(null);
              }}
              style={{
                padding: 10,
              }}
            >
              H???y
            </button>
            <button
              style={{
                padding: 10,
              }}
              type="button"
              class="btn btn-primary"
              onClick={() => {
                updateDateInMatch(matchCurrent);
              }}
            >
              Thay ?????i
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
