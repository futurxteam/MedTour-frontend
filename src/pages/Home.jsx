import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/Home.css";

const Home = () => {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="hero-section">
          <div className="container">
            <h1>Modern healthcare, made simple</h1>
            <p>
              Consult expert doctors, book procedures, and get medical care
              with transparency and trust.
            </p>
            <button className="hero-btn">Book free consultation</button>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services-section">
          <div className="container">
            <h2>Our medical solutions</h2>

            <div className="services-cards">
              <div className="card">
                <h3>Doctor Consultations</h3>
              </div>
              <div className="card">
                <h3>Surgeries & Treatments</h3>
              </div>
              <div className="card">
                <h3>Diagnostics & Care</h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
