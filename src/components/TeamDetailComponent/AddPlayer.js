import React, { useState,useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";


import "react-toastify/dist/ReactToastify.css";
const AddPlayer = (props) => {
  const {addPlayerInListPlayer,onClickAddPlayer,hideShow,setHideShowAdd} = props;
  useEffect(() => {
    if(hideShow === false){
      resetStateForm();
  }
  },[hideShow])
  const [imgPlayer, setImgPlayer] = useState({
    value: "",
    img: null,
    error: null,
  });
  const [emailPlayer, setEmailPlayer] = useState({
    value: "",
    error: null,
  });
  const [namePlayer, setNamePlayer] = useState({
    value: "",
    error: null,
  });
  const [DOBPlayer, setDOBPlayer] = useState({
    value: "",
    error: null,
  });
  const [phonePlayer, setPhonePlayer] = useState({
    value: "",
    error: null,
  });
  const [btnActive,setBtnActive] = useState(false);
  // useEffect(() => {
  //   if(checkAdd === true) setHideShow(true);
  //   else {
  //     setHideShow(false);
  //   }
  // },[checkAdd])
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const validate =validateForm(name,value);
    if(validate.flag){
      setBtnActive(true);
    }else{
      setBtnActive(false);
    }
    switch (name) {
      case "imgPlayer":
        
        setImgPlayer({
          value: e.target.files[0],
          img: URL.createObjectURL(e.target.files[0]),
          error: validate.content
        });
        break;
      case "emailPlayer":
        setEmailPlayer({
          ...emailPlayer,
          value,
          error: validate.content
        });

        break;
      case "namePlayer":
        setNamePlayer({
          ...namePlayer,
          value,
          error: validate.content
        });

        break;
      case "DOBPlayer":
        
        setDOBPlayer({
          ...DOBPlayer,
          value,
          error: validate.content
        });
        break;
      default:
        setPhonePlayer({
          ...phonePlayer,
          value,
          error: validate.content
        });

        break;
    }
  };
  const onSubmitHandler = async(e) => {
    e.preventDefault();
    const birthday = DOBPlayer.value.split("/");
    const data = {
      email: emailPlayer.value,
      playername: namePlayer.value,
      gender: props.gender,
      dateOfBirth: birthday[1] + "/" + birthday[0] + "/" + birthday[2],
      playerAvatar: imgPlayer.value,
      phone: phonePlayer.value,
      status: true,
    };
    await addPlayerInListPlayer(data);
      
    // if(addPlayer.status === 201){
    //   setHideShow(false)  
    // }
  };

  const validateForm = (name,value) => {
    
    switch (name) {
      case "imgPlayer":
        break;
      case "emailPlayer":
        if (value.length === 0) {
          return {
            flag: false,
            content: "Kh??ng ???????c ????? tr???ng",
          };
        } else if (
          !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        ) {
          return {
            flag: false,
            content: "Sai ?????nh d???ng email",
          };
        }
        
        break;
      case "namePlayer":
        if (value.length === 0) {
          return {
            flag: false,
            content: "Kh??ng ???????c ????? tr???ng",
          };
        } else if (/\d+/.test(value)) {
          return {
            flag: false,
            content: "T??n c???u th??? l?? ch???",
          };
        }
        break;
      case "DOBPlayer":
       
        if (value.length === 0) {
          
          return {
            flag: false,
            content: "Kh??ng ???????c ????? tr???ng",
          };
        } else if (!/(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/.test(value)) {
          return {
            flag: false,
            content: "Sai ?????nh d???ng ng??y sinh",
          };
        }
        break;
      default:
        if (value.length === 0) {
          return {
            flag: false,
            content: "Kh??ng ???????c ????? tr???ng",
          };
        } else if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "S??? ??i???n tho???i kh??ng ???????c l?? ch??? hay k?? t??? kh??c",
          };
        } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
          return {
            flag: false,
            content: "Sai ?????nh d???ng s??? ??i???n tho???i",
          };
        }
        break;
    }

    return { flag: true, content: null };
  }
  const resetStateForm = () => {
    const initialState = {
      value: "",
      error: null,
    };
    setImgPlayer(initialState);
    setEmailPlayer(initialState);
    setNamePlayer(initialState);
    setDOBPlayer(initialState);
    setPhonePlayer(initialState);
    setBtnActive(false);
    setHideShowAdd(false);
  };
  //const gender = props.gender;
  return (
    <div className="addPlayerWrap">
     <div className={hideShow?"overlay active":"overlay"} ></div>
      <div
        type="button"
        className="btn"
        style={{
          padding: 10,
        }}
        onClick={()=>{
          setHideShowAdd(true)
          onClickAddPlayer();
        }}
      >
        Th??m th??nh vi??n
      </div>

      <div
        className={hideShow?"popup__player active":"popup__player"}
        id="exampleModal"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                T???o m???i c???u th???
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  resetStateForm()
                }}
              ></button>
            </div>
            <form onSubmit={onSubmitHandler}>
              <div style={{
                height: 540
              }} class="modal-body">
                <div className="add_img">
                  <label htmlFor="email">H??nh ???nh c???u th???</label>
                  <input
                      type="file"
                      accept="image/*"
                      id="imgPlayer"
                      onChange={onChangeHandler}
                      
                      name="imgPlayer"
                      style={{
                        display: "none",
                      }}
                    />
                 
                    <label htmlFor="imgPlayer" className="add_img_detail">
                      <div style={{
                        width: "50%",
                        height: "50%",
                        overflow: "hidden",
                        marginLeft: "110px",
                        marginTop: "30px",
                        marginBottom: "30px"
                      }}>
                      {imgPlayer.img != null ? <img  style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                      }} src={imgPlayer.img} /> : null}
                      </div>
                      
                    <p className="add_img_detail_btn">
                      T???i ???nh l??n{" "}
                      <i
                        style={{
                          marginLeft: 10,
                        }}
                        className="fa-solid fa-upload"
                      ></i>
                    </p>
                    </label>
                    
                  
                </div>
                <div className="add_infor">
                  <div className="detail_info">
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline"
                    }}>
                    <label htmlFor="email">Email c???u th???</label>
                    {emailPlayer.error != null ? <p style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "red"
                    }}>{emailPlayer.error}</p> : <p></p>}
                    </div>
                    
                    <input
                      id="email"
                      type="text"
                      placeholder="Nh???p email c???u th???"
                      autoComplete="true"
                      name="emailPlayer"
                      value={emailPlayer.value}
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                  <div className="detail_info">
                  <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline"
                    }}>
                    <label htmlFor="name">T??n c???u th???</label>
                    {namePlayer.error != null ? <p style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "red"
                    }}>{namePlayer.error}</p> : <p></p>}
                    </div>
                    
                    <input
                      id="name"
                      name="namePlayer"
                      value={namePlayer.value}
                      type="text"
                      placeholder="Nh???p t??n c???u th???"
                      autoComplete="true"
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                  <div className="detail_info">
                    <label htmlFor="gender">Gi???i t??nh c???u th???</label>
                    <input
                      id="gender"
                      type="text"
                      value={props.gender === "Male" ? "Nam" : "N???"}
                      disabled
                    />
                  </div>
                  <div className="detail_info">
                  <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline"
                    }}>
                    <label htmlFor="DOB">Ng??y sinh c???u th??? (VD: 14/05/2000)</label>
                    {DOBPlayer.error != null ? <p style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "red"
                    }}>{DOBPlayer.error}</p> : <p></p>}
                    </div>
                  
                    
                    <input
                      id="DOB"
                      name="DOBPlayer"
                      value={DOBPlayer.value}
                      type="text"
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                  <div className="detail_info">
                  <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline"
                    }}>
                    <label htmlFor="phoneContact">S??? ??i???n tho???i c???u th???</label>
                    {phonePlayer.error != null ? <p style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "red"
                    }}>{phonePlayer.error}</p> : <p></p>}
                    </div>
                    
                    <input
                      id="phoneContact"
                      type="text"
                      name="phonePlayer"
                      value={phonePlayer.value}
                      autoComplete="true"
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  style={{
                    padding: 10,
                  }}
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetStateForm}
                >
                  H???y t???o
                </button>
                {btnActive ? <button
                  style={{
                    padding: 10,
                  }}
                  type="submit"
                  class="btn btn-primary"
                  data-backdrop="false"
                >
                  Th??m c???u th???
                </button> : null }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlayer;
