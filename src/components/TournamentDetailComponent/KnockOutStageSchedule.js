import React, { useState, useEffect } from "react";
import { Bracket, RoundProps } from "react-brackets";
import { Link } from "react-router-dom";
import ModalChangeDateInSchedule from "./ModelChangeDateInSchedule";
import { updateDateInMatchAPI } from "../../api/MatchAPI";
import { toast } from "react-toastify";
export default function KnockOutStageSchedule(props) {
  const {
    allTeam,
    typeView,
    hostTournamentId,
    tournamentType,
    groupNumber,
    hideShow,
    setHideShow,
    startDate,
    endDate,
    user,
    setStatusUpdateDate,
    statusUpdateDate,
  } = props;

  const [matchCurrent, setMatchCurrent] = useState(null);
  const [knockoutTeam, setKnoukoutTeam] = useState(null);
  const [dateUpdate, setDateUpdate] = useState(null);
  useEffect(() => {
    if (allTeam != null) {
      devideRound();
    }
  }, [allTeam]);

  const devideRound = () => {
    const data = [];
    let roundCurrent = null;
    let indexCurrent = 0;

    allTeam.map((item, index) => {
      if (index % 2 === 0) {
        if (roundCurrent === null) {
          roundCurrent =
            tournamentType == "GroupStage"
              ? item.match.groupFight
              : item.match.round;
          data.push({
            title:
              tournamentType == "GroupStage"
                ? item.match.groupFight
                : item.match.round,
            seeds: [
              {
                id: item.id,
                date: item.match.matchDate,
                match: item.match,
                teams: [
                  {
                    name: item.teamName,
                    team: item.team,
                    teamResult: item.result,
                    teamId: item.teamId,
                  },
                  {
                    name: allTeam[index + 1].teamName,
                    team: allTeam[index + 1].team,
                    teamResult: allTeam[index + 1].result,
                    teamId: allTeam[index + 1].teamId,
                  },
                ],
              },
            ],
          });
        } else if (
          roundCurrent ===
          (tournamentType == "GroupStage"
            ? item.match.groupFight
            : item.match.round)
        ) {
          data[indexCurrent].seeds.push({
            id: item.id,
            date: item.match.matchDate,
            match: item.match,
            teams: [
              {
                name: item.teamName,
                team: item.team,
                teamResult: item.result,
                teamId: item.teamId,
              },
              {
                name: allTeam[index + 1].teamName,
                team: allTeam[index + 1].team,
                teamResult: allTeam[index + 1].result,
                teamId: allTeam[index + 1].teamId,
              },
            ],
          });
        } else {
          indexCurrent += 1;
          roundCurrent =
            tournamentType == "GroupStage"
              ? item.match.groupFight
              : item.match.round;
          data.push({
            title:
              tournamentType == "GroupStage"
                ? item.match.groupFight
                : item.match.round,
            seeds: [
              {
                id: item.id,
                match: item.match,
                date: item.match.matchDate,
                teams: [
                  {
                    name: item.teamName,
                    team: item.team,
                    teamResult: item.result,
                    teamId: item.teamId,
                  },
                  {
                    name: allTeam[index + 1].teamName,
                    team: allTeam[index + 1].team,
                    teamResult: allTeam[index + 1].result,
                    teamId: allTeam[index + 1].teamId,
                  },
                ],
              },
            ],
          });
        }
      }
    });
    if (typeView === "diagram" && tournamentType != "GroupStage") {
      const nullTeamRoundOne = calcAllTeamRoundOne() - data[0].seeds.length;
      if (nullTeamRoundOne > 0) {
        let countI = 1;
        for (let i = 0; i < nullTeamRoundOne; i++) {
          data[0].seeds.splice(countI, 0, {
            id: null,
            date: null,
            teams: [
              { name: null, team: null, teamResult: null },
              { name: null, team: null, teamResult: null },
            ],
          });
          countI += 2;
        }
      }
    } else if (typeView === "diagram" && tournamentType == "GroupStage") {
      data.splice(0, groupNumber);
    }
    setKnoukoutTeam(data);
  };

  const calcAllTeamRoundOne = () => {
    if (allTeam.length > 8) {
      return 8;
    } else if (allTeam.length > 4) {
      return 4;
    } else return 2;
  };

  const onChangHandle = (e) => {
    setDateUpdate(e.target.value);
  };

  const updateDateInMatch = (dataMatch) => {
    
    const data = {
      ...dataMatch,
      matchDate: dateUpdate,
    };
    const response = updateDateInMatchAPI(data);
    response.then(res => {
      if(res.status === 201){
        setStatusUpdateDate(true);
      }
      
    }).catch(err =>{
      console.error(err);
    })
  };

  const rounds = knockoutTeam != null ? [...knockoutTeam] : null;

  return knockoutTeam !== null ? (
    typeView === "diagram" ? (
      <div
        style={{
          marginTop: 50,
        }}
      >
        <Bracket rounds={rounds} />
      </div>
    ) : (
      <div>
        {knockoutTeam.map((item, index) => {
          return (
            <table
              style={{
                marginBottom: 50,
              }}
              key={index}
              className="schedule__table"
            >
              <tr>
                <th
                  colSpan={
                    user != undefined && user.userVM.id === hostTournamentId
                      ? 7
                      : 6
                  }
                >
                  Bảng đấu trực tiếp - {item.title}
                </th>
              </tr>
              {item.seeds.map((itemSeeds, indexSeeds) => {
                return (
                  <tr key={indexSeeds}>
                    <td
                      style={{
                        color: indexSeeds.date != null ? "black" : "red",
                      }}
                    >
                      {indexSeeds.date != null
                        ? indexSeeds.date
                        : "Chưa cập nhật"}
                    </td>
                    {/* <td>{index + 1}</td> */}
                    <td>
                      {itemSeeds.teams[0].name}
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
                      {itemSeeds.teams[1].name}
                    </td>

                    <div
                      className={hideShow ? "overlay active" : "overlay"}
                    ></div>
                    {user != undefined &&
                    user.userVM.id === hostTournamentId ? (
                      <td
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontWeight: 700,
                          lineHeight: 1.6,
                        }}
                        onClick={() => {
                          setHideShow(true);
                          setMatchCurrent(itemSeeds.match);
                          setStatusUpdateDate(false);
                        }}
                      >
                        {indexSeeds.date != null ? "Chỉnh sửa " : "Cập nhật "}{" "}
                        ngày
                      </td>
                    ) : null}
                    {itemSeeds.teams[0].teamId !== 0 &&
                    itemSeeds.teams[1].teamId !== 0 ? (
                      <td>
                        {" "}
                        <Link
                          to={`/match/${itemSeeds.id}/matchDetail`}
                          state={{ hostTournamentId }}
                        >
                          Chi tiết
                        </Link>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                );
              })}
            </table>
          );
        })}
        {matchCurrent != null ? (
          <ModalChangeDateInSchedule
            hideShow={hideShow}
            setHideShow={setHideShow}
            matchCurrent={matchCurrent}
            startDate={startDate}
            endDate={endDate}
            dateUpdate={dateUpdate}
            setDateUpdate={setDateUpdate}
            onChangHandle={onChangHandle}
            updateDateInMatch={updateDateInMatch}
          />
        ) : null}
      </div>
    )
  ) : null;
}