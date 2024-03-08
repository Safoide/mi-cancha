import logo from "../img/icon/icon-futbol.png";

function Footer() {
  return (
    <div className="footer-section">
      <div className="container">
        <div className="footer-cta pt-5">
          <div className="row">
            <div className="col-xl-4 col-md-4 mb-3">
              <div className="single-cta">
                <i className="fas fa-map-marker-alt"></i>
                <div className="cta-text">
                  <h4>¿De dónde somos?</h4>
                  <span>Luján, Pcia. de Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-4 mb-3">
              <div className="single-cta">
                <i className="fas fa-phone"></i>
                <div className="cta-text">
                  <h4>Escribinos</h4>
                  <span>2323522637</span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-4 mb-3">
              <div className="single-cta">
                <i className="far fa-envelope-open"></i>
                <div className="cta-text">
                  <h4>Envianos un correo</h4>
                  <span>micancha@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-content pt-5 pb-5">
          <div className="row">
            <div className="col-xl-4 col-lg-4 mb-5">
              <div className="footer-widget">
                <div className="footer-logo">
                  <a id="icono-futbol" href="/">
                    <img
                      className="d-inline-block"
                      src={logo}
                      alt="logo de Mi Cancha"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-3">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>Links útiles</h3>
                </div>
                <ul>
                  <li>
                    <a href="/login">Iniciar sesión</a>
                  </li>
                  <li>
                    <a href="/registerCancha">Registrar mi cancha</a>
                  </li>
                  <li>
                    <a href="/canchas">Canchas</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-3">
              <div className="footer-widget">
                <div className="footer-social-icon">
                  <span>Seguinos</span>
                  <a href="#">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter twitter-bg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 text-center text-lg-left">
              <div className="copyright-text">
                <p>© 2023 Derechos reservados Mi Cancha</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">
              <div className="footer-menu">
                <ul>
                  <li>
                    <a href="/login">Iniciar sesión</a>
                  </li>
                  <li>
                    <a href="/registerCancha">Registrar mi cancha</a>
                  </li>
                  <li>
                  <a href="/canchas">Canchas</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
