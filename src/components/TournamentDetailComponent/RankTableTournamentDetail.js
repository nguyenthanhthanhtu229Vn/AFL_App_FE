import React, { useEffect, useState } from "react";
import "./styles/style.css";
import { getTeamPaticaipateInTourByTourIDAPI } from "../../api/TeamInTournamentAPI";
import { getTeamByIdAPI } from "../../api/TeamAPI";
import LoadingAction from "../LoadingComponent/LoadingAction";
function RankTableTournamentDetail(props) {
  const { tourDetail } = props;
  const [ranking, setRaking] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getTeamInTournament();
  }, []);
  const getInfoTeam = async (id) => {
    try {
      const response = await getTeamByIdAPI(id);
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getTeamInTournament = async () => {
    setLoading(true);
    try {
      const response = await getTeamPaticaipateInTourByTourIDAPI(tourDetail.id);
      if (response.status === 200) {
        const teamPaticipate = response.data.teamInTournaments;
        if (teamPaticipate.length > 0) {
          for (let i = 0; i < teamPaticipate.length; i++) {
            const team = await getInfoTeam(teamPaticipate[i].teamId);
            teamPaticipate[i].team = team;
          }
        }
        createRanking(teamPaticipate);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createRanking = (data) => {
    const ranking = [];
    const numberTeamPaticipate = tourDetail.footballTeamNumber;
    if (tourDetail.tournamentTypeId === 2) {
      for (let i = 0; i < numberTeamPaticipate; i++) {
        if (data[i] !== undefined) {
          ranking.push(data[i]);
        } else {
          ranking.push(null);
        }
      }
      const findIndexNull = ranking.findIndex((obj) => obj === null);
      if (findIndexNull === -1) {
        ranking.sort((teamA, teamB) => {
          return (
            teamB.point - teamA.point ||
            teamB.differentPoint - teamA.differentPoint ||
            teamB.winScoreNumber - teamA.winScoreNumber
          );
        });
      }
    } else {
      const tableInTournament = tourDetail.groupNumber;
      const teamInTable = Math.floor(numberTeamPaticipate / tableInTournament);
      const tableName = [
        {
          title: "B???ng A",
          numberTeam: teamInTable,
        },
        {
          title: "B???ng B",
          numberTeam: teamInTable,
        },
        {
          title: "B???ng C",
          numberTeam: teamInTable,
        },
        {
          title: "B???ng D",
          numberTeam: teamInTable,
        },
      ];

      const residualNumber =
        numberTeamPaticipate - teamInTable * tableInTournament;

      if (residualNumber > 0) {
        for (let i = 0; i < residualNumber; i++) {
          tableName[i].numberTeam++;
        }
      }

      for (
        let i = 0;
        i < Math.ceil(numberTeamPaticipate / tableInTournament);
        i++
      ) {
        const allTeam = [];
        for (const item of data) {
          if (item.groupName === tableName[i].title) {
            allTeam.push(item);
          }
        }
        allTeam.sort((teamA, teamB) => {
          return (
            teamB.point - teamA.point ||
            teamB.differentPoint - teamA.differentPoint ||
            teamB.winScoreNumber - teamA.winScoreNumber
          );
        });
        for (let j = 0; j < tableName[i].numberTeam; j++) {
          if (allTeam[j] === undefined) {
            allTeam.push(null);
          }
        }

        ranking.push({
          title: tableName[i].title,
          team: allTeam,
        });
      }
      console.log(ranking);
    }
    setLoading(false);
    setRaking(ranking);
  };

  return (
    <>
      <div className="tournamentdetail">
        <div className="teamdetail__content rank__tour">
          <h2 className="title">Ba??ng x????p ha??ng</h2>
          <p className="note">
            *L??u y??: Chi?? a??p du??ng cho hi??nh th????c ??a?? vo??ng tro??n ho????c vo??ng ba??ng cu??a
            hi??nh th????c chia ba??ng
          </p>
          {loading ? (
            <LoadingAction />
          ) : ranking !== null ? (
            tourDetail.tournamentTypeId == 2 ? (
              <div className="wrap__table">
                <div className="name__table">
                  <h5>Ba??ng x???p h???ng</h5>
                </div>
                <div className="name__table-cross"></div>
                <table className="table__team">
                  <tr>
                    <th>Ha??ng</th>
                    <th>T??n ??????i</th>
                    <th>S???? tr????n</th>
                    <th>Th????ng</th>
                    <th>Ho??a</th>
                    <th>Ba??i</th>
                    <th>Hi????u s????</th>
                    <th>The?? va??ng/The?? ??o??</th>
                    <th>??i????m</th>
                  </tr>
                  {ranking.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {item !== null
                            ? item.team.teamName
                            : `?????i ${index + 1}`}
                        </td>
                        <td>{item !== null ? item.numberOfMatch : 0}</td>
                        <td>{item !== null ? item.numberOfWin : 0}</td>
                        <td>{item !== null ? item.numberOfDraw : 0}</td>
                        <td>{item !== null ? item.numberOfLose : 0}</td>
                        <td>{item !== null ? item.differentPoint : 0}</td>
                        <td>
                          {item !== null
                            ? `${item.totalYellowCard}/${item.totalRedCard}`
                            : 0}
                        </td>
                        <td>{item !== null ? item.point : 0}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            ) : (
              ranking.map((itemIn, indexIn) => {
                return (
                  <div
                    style={{
                      marginBottom: 20,
                    }}
                    className="wrap__table"
                  >
                    <div className="name__table">
                      <h5>{itemIn.title}</h5>
                    </div>
                    <div className="name__table-cross"></div>
                    <table className="table__team">
                      <tr>
                        <th>Ha??ng</th>
                        <th>T??n ??????i</th>
                        <th>S???? tr????n</th>
                        <th>Th????ng</th>
                        <th>Ho??a</th>
                        <th>Ba??i</th>
                        <th>Hi????u s????</th>
                        <th>The?? va??ng/The?? ??o??</th>
                        <th>??i????m</th>
                      </tr>
                      {itemIn.team.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item !== null
                                ? item.team.teamName
                                : "Ch??a tham gia"}
                            </td>
                            <td>{item !== null ? item.numberOfMatch : 0}</td>
                            <td>{item !== null ? item.numberOfWin : 0}</td>
                            <td>{item !== null ? item.numberOfDraw : 0}</td>
                            <td>{item !== null ? item.numberOfLose : 0}</td>
                            <td>{item !== null ? item.differentPoint : 0}</td>
                            <td>
                              {item !== null
                                ? `${item.totalYellowCard}/${item.totalRedCard}`
                                : 0}
                            </td>
                            <td>{item !== null ? item.point : 0}</td>
                          </tr>
                        );
                      })}
                    </table>
                  </div>
                );
              })
            )
          ) : null}
        </div>
      </div>
    </>
  );
}

export default RankTableTournamentDetail;
