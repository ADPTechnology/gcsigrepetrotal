<nav class="navbar navbar-expand-lg main-navbar">

    <ul class="navbar-nav d-flex flex-grow-1 flex-nowrap">
        <li class="d-flex align-items-center"><a href="#" data-toggle="sidebar" class="nav-link nav-link-lg"><i class="fas fa-bars"></i></a></li>

        <div class="company-info-welcome text-nowrap">
            <span class="welcome text-truncate" style="text-overflow: ellipsis">
                Perú, {{ getDateEsAttribute(getCurrentDate()) }}
            </span>
            {{-- <span class="company-name text-truncate">
                DAVEC INGENIEROS EIRL
            </span> --}}
        </div>
    </ul>

    <ul class="navbar-nav navbar-right">

        <li class="dropdown dropdown-list-toggle">
            <a href="#" data-toggle="dropdown" class="nav-link nav-link-lg d-flex" style="gap: .6em;">
                <i class="fa-solid fa-caret-down fa-2xs"></i>
                <img style="width: 80%; height: fit-content;"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMElEQVR4nO2ZSWgUQRSGW4nRIG7RXBTEQ3BLRBEvSgQRheQiKBhEvLgcvKgHiaIiGIUkLuCKuIsH8eBBBLeYiwaDiIIhejEKBp14CKLRuCTG5JNn3kBn7Fl6pqq7kfwwzExT9b/3d9V7VfXKcYbwHwMoBjYCF4CHwDvgE/AbaAGKnKgCGA1sAZ6THtETAwwHNgMf8YdeIAY8Aa4BG4ApYYkoAuoxiwZgQdBx0IYd9AOngRG2RUzWALaNB8AEWyLygMcEh3sShzaEVBE89tlIsR0hCOk2mtGAnYSHY6ZEDAsowJPhK5BvQsg8wscSE0J2G3bqBfDdZ586E0JuGhRxFhgFVAA/ffS7bUJIswEBTcDiBN4yoD3D/i0mhHzOIXVeTTW/gfHA5Qy4Ok0I8bNPagWuAKuBsT5slOlKnhS2hLTpwUmc3gUsk7drwNZcWTcCE5IzaXqbvcAOYKJJ0jCEbLdBGoaQSfot2S4OyXB1Wa/yYQhJE5+1jl8ABREU0p4N0YEICiEbIinfCDYBh4DXQKMVry0L6dK+BVY8DVDIe+07zYqnAQq5rn3PyQHLirep7Xshlg1RKfBLCRqBvcBIK1572/dCTbZk5cAXF9FK4x4nt/3IZVfKrDU5HXtlJwtUK2G9UW+9awSrXP//wnSBLqbb9WJjxP/aWQ70AFuBQtXRZdpIfFSOGCUebOOO2jgBLNTfL23Ufnu0RFNolHyAf5aOuHxmAmfiohwLxi4qebUF7vPKfQOYrwWKPmC2Y+mt9emV2rgU7fKBg8AHV+bp0Gd5Hu1L9EAl13TrNB4Fp4yLcBmVI67gaIo2cnYg0604cDce2K61q8Hq9giYqsMub7A0SZtMSz1e6AdOSg3MmgiXo/vVaFOSqZKNkFYVUGJdQEIMNCcracr0STe19EL1vj57ZqRYnUP5plunwhoPobUJIzMo2IHjrriYEYoIl8OVmsUkXip9bEPiyUACu8KJAoBt6pQIOpxqh6xX27dcQb3eiRKAtcA3dfAtsEen3hh1fpFOpU5tI98rnCgCmAM8zSA7yfZ8uhNlMDD/y3XRfAP80IudV8AlYGnYPg7BCQB/ACP5Pjrzc9jVAAAAAElFTkSuQmCC">
            </a>

            <div class="dropdown-menu dropdown-list dropdown-menu-right">

                <div class="dropdown-header">
                    <i class="fa-solid fa-phone me-2"></i>
                    Números de contacto
                </div>
                <div class="dropdown-list-content dropdown-list-message">

                    <div class="dropdown-item">
                        <div class="dropdown-item-avatar">
                            <img
                                src="data:image/png;base64,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">
                        </div>

                        <div class="dropdown-item-desc d-flex align-items-center justify-content-between">

                            <div>
                                <b>Yandira</b>
                                <p>942 416 280</p>
                            </div>
                            <div>
                                <a href="https://wa.me/51942416280" target="_BLANK"
                                    style="font-size: 2em; color: #25d366;">
                                    <i class="fa-brands fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>

                    </div>

                    <div href="#" class="dropdown-item">
                        <div class="dropdown-item-avatar">
                            <img
                                src="data:image/png;base64,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">
                        </div>
                        <div class="dropdown-item-desc d-flex align-items-center justify-content-between">
                            <div>
                                <b>J. Ayllon</b>
                                <p>956 986 426</p>
                            </div>
                            <div>
                                <a href="https://wa.me/51956986426" target="_BLANK"
                                    style="font-size: 2em; color: #25d366;">
                                    <i class="fa-brands fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </li>

        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="form-inline mr-auto">
            @csrf

            <li class="dropdown ms-auto me-2 user-info-content">
                <a href="#" data-toggle="dropdown" class="nav-link dropdown-toggle nav-link-lg nav-link-user">
                    <div class="d-sm-none d-lg-inline-block inner-info-container">
                        <i class="fa-solid fa-user"></i> &nbsp;&nbsp;
                        Hola, {{ Auth::user()->name }}
                    </div>
                </a>
                <div class="dropdown-menu dropdown-menu-right mt-4">
                    <a href="{{ route('profile.index') }}" class="dropdown-item has-icon text-primary">
                        <i class="fa-regular fa-user"></i>
                        &nbsp;
                        Perfil
                    </a>
                    <a href="" class="dropdown-item has-icon text-danger"
                        onclick="event.preventDefault();
                                document.getElementById('logout-form').submit();">
                        <i class="fas fa-sign-out-alt"></i> Cerrar sesión
                    </a>
                </div>
            </li>
        </form>
    </ul>


</nav>
