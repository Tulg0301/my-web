import BannerProduct from "@/components/BannerProduct";
import CategoryList from "@/components/CategoryList";
import HorizontalCartProduct from "@/components/HorizontalCartProduct";

export default function App() {
  return (

    <div className="app">
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCartProduct category={"Di động"} heading="nổi bật"/>
      <HorizontalCartProduct category={"TV"} heading="bán chạy"/>
      <HorizontalCartProduct category={"Airpodes"} heading="bán chạy"/>
      
      <HorizontalCartProduct category={"Tủ lạnh"} heading="nổi bật"/>
      <HorizontalCartProduct category={"Đồng hồ"} heading="nổi bật"/>
      <HorizontalCartProduct category={"Máy ảnh"} heading="nổi bật"/>
      <HorizontalCartProduct category={"CPU"} heading="nổi bật"/>
      <HorizontalCartProduct category={"Chuột"} heading="nổi bật"/>
    </div>
  );
}
