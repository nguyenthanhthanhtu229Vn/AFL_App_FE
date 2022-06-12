import React, { useState, useEffect } from "react";

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
    teamInUpdate
  } = props;

  const [newStart, setNewStart] = useState(null);
  useEffect(() => {
    const time = startDate.split(" ");
    const date =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    const month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
        const conditon = time[0];
        let dateData = new Date(conditon);
        let dateCurrent = new Date(
          date + "/" + month + "/" + time[0].split("/")[2]
        );

    if (+dateCurrent > +dateData) {
      let newTime =
        time[0].split("-")[0] + "-" + month + "-" + date + "T" + time[1];
      //console.log(time);
      setNewStart(newTime);
      setDateUpdate(matchCurrent != null &&  matchCurrent.matchDate != null ? matchCurrent.matchDate : newTime);
      //console.log(newTime);
    } else {
      setNewStart(startDate);
      setDateUpdate(matchCurrent != null &&  matchCurrent.matchDate != null ? matchCurrent.matchDate : startDate);
    }
  }, [matchCurrent.id]);
  const changeDate = (data) => {
    const splitDateTime = data.split("T");
    return (
      splitDateTime[0].split("-")[2] +
      "-" +
      splitDateTime[0].split("-")[1] +
      "-" +
      splitDateTime[0].split("-")[0] +
      " " +
      splitDateTime[1].split(":")[0] +
      ":" +
      splitDateTime[1].split(":")[1]
    );
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
              Thay đổi ngày giờ trận đấu
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setHideShow(false);
                setMatchCurrent(null);
              }}
            ></button>
          </div>
          <p style={{
            marginTop:20,
            textAlign: "center",
            fontWeight: 600
          }}>{teamInUpdate}</p>
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
                Ngày giờ hiện tại của trận đấu:{" "}
                {changeDate(matchCurrent.matchDate)}{" "}
                <p>Sửa ngày giờ thi đấu:</p>
                <input
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
                  Hiện tại trận đấu chưa có ngày giờ diễn ra hãy cập nhật nó
                </p>

                <input
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
                />
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
              }}
              style={{
                padding: 10,
              }}
            >
              Hủy
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
              Thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
