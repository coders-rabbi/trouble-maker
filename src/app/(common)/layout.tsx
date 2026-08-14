import Footer from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/navbar/navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default CommonLayout;
