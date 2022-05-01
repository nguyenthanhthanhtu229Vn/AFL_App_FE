import React from 'react'
import "./styles/style.css";
const CreateHome = () => {
  return (
    <div className="products pd">
        <div className="product">
            <div className="product__text textbox">
                <h2 className="titlemain">tạo giải đấu</h2>
                <p className="description">Bạn có thể tổ chức một giải đấu qua hình thức online với các thể thức thi đấu đa dạng khác nhau còn gì tuyệt hơn</p>
                <a href="#" className="btnmore">xem thêm <img src="assets/icons/arrow.png" alt="arrowRight"/></a>
            </div>
            <div className="product__img">
                <img src="/assets/img/homepage/product1.png" alt="product"/>
            </div>
        </div>
        <div className="product">
            <div className="product__text textbox --textright ">
                <h2 className="titlemain ">tạo đội bóng</h2>
                <p className="description ">Bạn có thể tạo một đội bóng hình thức online với các thể thức thi đấu đa dạng khác nhau còn gì tuyệt hơn</p>
                <a href="# " className="btnmore ">xem thêm <img src="assets/icons/arrow.png" alt="arrowRight "/></a>
            </div>
            <div className="product__img ">
                <img src="/assets/img/homepage/product2.png " alt="product "/>
            </div>
        </div>
</div>
  )
}

export default CreateHome