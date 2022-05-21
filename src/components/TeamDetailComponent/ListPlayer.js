import React, { useEffect, useState } from "react";
import "./styles/style.css";
import { getAPI, postAPI } from "../../api/index";
import { toast } from "react-toastify";
import AddPlayer from "./AddPlayer";
import Loading from "../LoadingComponent/Loading";
import { addFootballPlayer , editFootballPlayerAPI } from "../../api/FootballPlayer";
import { addPlayerInTeamAPI } from "../../api/PlayerInTeamAPI";
import ReactPaginate from "react-paginate";
import styles from "../FindTeamComponent/TeamFind.module.css";
import EditInforPlayer from "./EditInForPlayer";
import LoadingAction from "../LoadingComponent/LoadingAction"
function ListPlayer(props) {
  const { id, gender, numberPlayerInTeam, idHost } = props;
  const [loading, setLoading] = useState(true);
  const [loadingAdd,setLoadingAdd] = useState(false);
  const [playerInTeam, setPlayerInTeam] = useState(null);
  const [addPlayerComplete, setAddPlayerComplete] = useState(false);
  const [namePlayer, setNamePlayer] = useState("");
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    getListPlayerInTeamByIdTeam();
  }, [addPlayerComplete, currentPage, namePlayer]);
  const getListPlayerInTeamByIdTeam = async () => {
    setLoading(true);
    const afterURL = `PlayerInTeam?teamId=${id}&name=${namePlayer}&pageIndex=${currentPage}&limit=8`;
    const response = await getAPI(afterURL);
    console.log(response);
    setCount(response.data.countList);
    const ids =
      namePlayer === ""
        ? response.data.playerInTeams
        : response.data.playerInTeamsFull;
    const players = ids.map(async (player) => {
      const playerResponse = await getPlayerById(player.footballPlayerId);
      return playerResponse;
    });
    const playersData = await Promise.all(players);
    setPlayerInTeam(playersData);
    setLoading(false);
  };

  const getPlayerById = async (idPlayer) => {
    const afterURL = `football-players/${idPlayer}`;
    const response = await getAPI(afterURL);
    return response.data;
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  const addPlayerInListPlayer = (data) => {
    setLoadingAdd(true);
    const response = addFootballPlayer(data);
    // postAPI(url, data, true);
    response
      .then((res) => {
        if (res.status === 201) {
          addPlayerInTeam(res.data.id);
        }
      })
      .catch((err) => {
        setLoadingAdd(false);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(err);
      });
  };
  const addPlayerInTeam = (idPlayer) => {
    setLoadingAdd(true);
    const data = {
      teamId: props.id,
      footballPlayerId: idPlayer,
    };
    const response = addPlayerInTeamAPI(data);
    response
      .then((res) => {
        setLoadingAdd(false);
        if (res.status === 201) {
          //resetStateForm();
          setAddPlayerComplete(true);
          toast.success("Thêm cầu thủ vào đội bóng thành công", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // navigate(`/teamDetail/${props.id}/inforTeamDetail`);
        }
      })
      .catch((err) => {
        setLoadingAdd(false);
        console.error(err);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const onClickAddPlayer = () => {
    setAddPlayerComplete(false);
  };
  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setNamePlayer(value);
    setCurrentPage(1);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };
  const editInforFootballPlayer = (data) => {
    setLoadingAdd(true);
    const response = editFootballPlayerAPI(data);
    response
    .then((res) => {
      if (res.status === 200) {
        setLoadingAdd(false);
        setAddPlayerComplete(true);
        toast.success("Thay đổi thông tin cầu thủ thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // navigate(`/teamDetail/${props.id}/inforTeamDetail`);
      }
    })
    .catch((err) => {
      setLoadingAdd(false);
      console.error(err);
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  }
  return (
    <>
      <div className="teamdetail__content listPlayer">
        <h3 className="listPlayer__title">Danh sách thành viên</h3>
        {idHost === id ?  <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: 30,
          }}
        >
          <AddPlayer
          
            id={id}
            gender={gender}
            addPlayerInListPlayer={addPlayerInListPlayer}
            onClickAddPlayer={onClickAddPlayer}
          />
        </div> : null}
      

        <div>
          <h2 className="listPlayer__total">
            Có {numberPlayerInTeam} thành viên
          </h2>
          <div>
            <div>
              <label
                htmlFor="namePlayer"
                style={{
                  fontWeight: 700,
                  marginBottom: 30,
                  fontSize: 16,
                }}
              >
                Tìm kiếm cầu thủ theo tên:{" "}
              </label>
              <input
                style={{
                  marginLeft: 20,
                  padding: "5px 10px",
                  width: 300,
                }}
                placeholder="Tên cầu thủ"
                value={namePlayer}
                id="namePlayer"
                name="namePlayer"
                onChange={onHandleChange}
              />
            </div>

            {loading ? (
              <Loading />
            ) : (
              <div className="listPlayer__list">
                {playerInTeam.length > 0 ? (
                  playerInTeam.map((item, index) => {
                    return (
                      <div
                        key={index}
                        // style={{
                        //   cursor: "pointer",
                        // }}
                        className="listPlayer__item"
                      >
                        <form onSubmit={onSubmitHandler}>
                          <div className="avt">
                            <img src={item.playerAvatar} alt="dev" />
                          </div>
                          <div className="des">
                            <p className="namePlayer">
                              <span>Tên:</span>
                              {item.playername}
                            </p>
                            <p className="genderPlayer">
                              <span>Giới tính:</span>
                              {item.gender === "Male" ? "Name" : "Nữ"}
                            </p>
                            <p className="mailPlayer">
                              <span>Email:</span>
                              <span className="namePlayerInTeam">
                                {item.email}
                              </span>
                            </p>
                            <p className="phonePlayer">
                              <span>Sdt:</span>
                              {item.phone}
                            </p>
                            <p className="dobPlayer">
                              <span>Ngày sinh:</span>
                              {item.dateOfBirth.split("-")[2].split("T")[0] +
                                "/" +
                                item.dateOfBirth.split("-")[1] +
                                "/" +
                                item.dateOfBirth.split("-")[0]}
                            </p>
                          </div>
                          {/* <input className="btn_EditInforPlayer"
                            style={{
                              padding: "10px 20px",
                              display: "block",
                              margin: "0 auto",
                              marginBottom: 20,
                              fontWeight: 500,
                              fontFamily: "Mulish-Bold",
                              borderRadius: 5,
                              backgroundColor: "#D7FC6A",
                              border: 1,
                              borderColor: "#D7FC6A",
                              transition: "0.5s",
                            }}
                            type="submit"
                            value="Chỉnh sửa thông tin"
                          /> */}
                        {idHost === id ?
                          <EditInforPlayer onClickAddPlayer={onClickAddPlayer} editInforFootballPlayer={editInforFootballPlayer} player={item} />
                          : null }
                        </form>
                      </div>
                    );
                  })
                ) : (
                  <p
                    style={{
                      color: "red",
                      fontWeight: 600,
                      fontSize: 24,
                    }}
                  >
                    Không tìm thấy cầu thủ
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <nav
          aria-label="Page navigation example"
          className={styles.pagingTournament}
        >
          <ReactPaginate
            previousLabel={"Trang trước"}
            nextLabel={"Trang sau"}
            containerClassName="pagination"
            activeClassName={styles.active}
            pageClassName={styles.pageItem}
            nextClassName={styles.pageItem}
            previousClassName={styles.pageItem}
            breakLabel={"..."}
            pageCount={Math.ceil(count / 8)}
            marginPagesDisplayed={3}
            onPageChange={handlePageClick}
            pageLinkClassName={styles.pagelink}
            previousLinkClassName={styles.pagelink}
            nextLinkClassName={styles.pagelink}
            breakClassName={styles.pageItem}
            breakLinkClassName={styles.pagelink}
            pageRangeDisplayed={2}
          />
        </nav>

        {loadingAdd === true ? <LoadingAction /> : null}
      </div>
    </>
  );
}
export default ListPlayer;
