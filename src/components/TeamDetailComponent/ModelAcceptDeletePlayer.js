import React, { useState, useEffect } from "react";

export default function ModelAcceptDeletePlayer(props) {
    const {hideShowDelete,setHideShowDelete,deletePlayerInTeam,idDelete,setIdDelete} = props;
  return (
    <div
      id="exampleModal"
      className={hideShowDelete?"popup__player active":"popup__player"}
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setHideShowDelete(false);
                setIdDelete(null);
            }}
            ></button>
          </div>
          <div class="modal-body">Bạn có chắc chắn muốn xóa cầu thủ này?</div>
          <div class="modal-footer">
            <button
            style={{
              padding:10
            }}
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => {
                setHideShowDelete(false)
                setIdDelete(null);
            }}
            >
              Hủy
            </button>
            <button style={{
              padding:10
            }}  type="button" class="btn btn-primary" 
            onClick={() => {
              deletePlayerInTeam(idDelete);
            }}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}