import { Link } from "react-router-dom"
import "../styles/NavBar.css"

const Navbar = () => {
    return (
        <div>
<nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">
  <div class="container-fluid justify-content-between">
    <div class="d-flex">
      <a class="navbar-brand me-2 mb-1 d-flex align-items-center" href="#">
        <img
          src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
          height="20"
          alt="MDB Logo"
          loading="lazy"
        />
      </a>

      <form class="input-group w-auto my-auto d-none d-sm-flex">
        <input
          autocomplete="off"
          type="search"
          class="form-control rounded"
          placeholder="Search"
        />
        <span class="input-group-text border-0 d-none d-lg-flex"
          ><i class="fas fa-search"></i></span>
      </form>
    </div>

    <ul class="navbar-nav flex-row d-none d-md-flex">
      <li class="nav-item me-3 me-lg-1 active">
        <Link class="nav-link" to="/">
          <span><i class="fas fa-home fa-lg"></i></span>
          <span class="badge rounded-pill badge-notification bg-danger">1</span>
        </Link>
      </li>

      <li class="nav-item me-3 me-lg-1">
        <Link class="nav-link" to="/product-form">
          <span><i class="fab fa-elementor fa-lg"></i></span>
        </Link>
      </li>

      <li class="nav-item me-3 me-lg-1">
        <Link class="nav-link" to="/product-list">
          <span><i class="fas fa-rectangle-list fa-lg"></i></span>
        </Link>
      </li>

      <li class="nav-item me-3 me-lg-1">
        <Link class="nav-link" to="/package-form">
          <span><i class="fas fa-box fa-lg"></i></span>
        </Link>
      </li>

      <li class="nav-item me-3 me-lg-1">
        <Link class="nav-link" to="/event-list">
          <span><i class="fas fa-calendar fa-lg"></i></span>
          
        </Link>
      </li>
      <li class="nav-item me-3 me-lg-1">
        <Link class="nav-link" to="/order-list">
          <span><i class="fas fa-clipboard-list fa-lg"></i></span>
          
        </Link>
      </li>
    </ul>


  </div>
</nav>

        </div>
    )
}
export default Navbar