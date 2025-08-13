@extends('principal.common.layouts.masterpage')

@section('content')


    <div class="row content">

        <div class="title-page-header">
            <div class="card page-title-container">
                <div class="card-header">
                    <div class="total-width-container">
                        <h4>PERFIL DE USUARIO</h4>
                    </div>
                </div>
            </div>

            <div class="profile-view-container">

                <div class="principal-container card-body profile-page-container card z-index-2 mt-4">

                    <div class="container-information-main">

                        <div class="header-title">
                            <span class="title">Información General</span>
                        </div>
                        <div class="line-80"></div>

                        <div class="data-profile-container">
                            <div class="profile-row">
                                <div class="profile-label">Perfil:</div>
                                <div class="profile-info">{{ $user->role->name ?? '-' }}</div>
                            </div>

                            <div class="profile-row">
                                <div class="profile-label">Nombre de usuario:</div>
                                <div class="profile-info">{{ $user->user_name }}</div>
                            </div>

                            <div class="profile-row">
                                <div class="profile-label">Nombre:</div>
                                <div class="profile-info">
                                    {{ $user->name }}
                                </div>
                            </div>
                            <div class="profile-row">
                                <div class="profile-label">Email:</div>
                                <div class="profile-info">{{ $user->email ?? '-' }}</div>
                            </div>

                            <div class="profile-row">
                                <div class="profile-label">Teléfono:</div>
                                <div class="profile-info">{{ $user->phone ?? '-' }}</div>
                            </div>

                            <div class="profile-row">
                                <div class="profile-label">Empresa:</div>
                                <div class="profile-info">
                                    @if ($user->ownerCompany)
                                        <ul>
                                            <li>
                                                {{ $user->ownerCompany->name ?? '-' }}
                                            </li>
                                        </ul>
                                    @elseif($user->companies->isNotEmpty())
                                        <ul>
                                            @foreach ($user->companies as $company)
                                                <li>
                                                    {{ $company->name }}
                                                </li>
                                            @endforeach
                                        </ul>
                                    @else
                                        -
                                    @endif
                                </div>
                            </div>

                            <div class="profile-row">
                                <div class="profile-label">Notas:</div>
                                <div class="profile-info">{{ $user->comment ?? '-' }}</div>
                            </div>

                            <div id="form-container-update-password">

                                <form action="{{ route('profile.updatePassword', $user) }}" id="user_password_update_form" method="POST">
                                    @include('principal.common.profile.partials.components._form_update_password')
                                </form>
                            </div>


                        </div>

                    </div>

                </div>

            </div>


        </div>

    </div>

@endsection

@section('modals')
@endsection


@section('extra-script')
<script type="module" src="{{ asset('assets/principal/js/profile.js') }}"></script>
@endsection
