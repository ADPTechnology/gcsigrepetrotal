@extends('principal.common.layouts.masterpage')

@section('content')
    <div class="row content">

        <div class="title-page-header">
            <div class="card page-title-container">
                <div class="card-header">
                    <div class="total-width-container">
                        <h4>MANTENIMIENTO DE TABLAS</h4>
                    </div>
                </div>
            </div>

            <div class="principal-container card-body card z-index-2">

                <ul class="nav nav-tabs" id="warehouses-tab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="inter_management_tab" data-toggle="tab" href="#inter_management"
                            role="tab" aria-controls="inter_management" aria-selected="true">
                            Gestión Interna
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" id="ext_management_tab" data-toggle="tab" href="#ext_management" role="tab"
                            aria-controls="ext_management" aria-selected="true">
                            Gestión Externa
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" id="ext_disposition_tab" data-toggle="tab" href="#ext_disposition"
                            role="tab" aria-controls="ext_disposition" aria-selected="true">
                            Disposición Final Externa
                        </a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" id="disposition_place_tab" data-toggle="tab" href="#disposition_place"
                            role="tab" aria-controls="disposition_place" aria-selected="true">
                            Lugar Disposición
                        </a>
                    </li>
                </ul>


                <div class="tab-content" id="management-tab-container">

                    <div class="tab-pane fade show active" id="inter_management" role="tabpanel"
                        aria-labelledby="inter_management">


                        <form action="{{ route('interManagement.store') }}" id="registerInterManagementForm" method="POST">
                            @csrf
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label for="inputNameIntManagement">Agregar Gestión Interna: </label>
                                    <div class="input-group">
                                        <input id="inputNameIntManagement" name="name" class="form-control"
                                            type="text" placeholder="Nombre de gestión interna" required>
                                        <div class="input-group-prepend">
                                            <button type="submit" class="btn btn-primary btn-save">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                                <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>


                        <table id="inter_management-table" class="table table-hover" data-url="{{ route('managementTables.index') }}">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                        </table>


                    </div>

                    <div class="tab-pane fade" id="ext_management" role="tabpanel" aria-labelledby="ext_management">
                        <form action="{{ route('extManagement.store') }}" id="registerExtManagementForm" method="POST">
                            @csrf
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label for="inputNameExtManagement">Agregar Gestión Externa: </label>
                                    <div class="input-group">
                                        <input id="inputNameExtManagement" name="name" class="form-control"
                                            type="text" placeholder="Nombre de gestión externa" required>
                                        <div class="input-group-prepend">
                                            <button type="submit" class="btn btn-primary btn-save">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                                <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <table id="ext_management_table" class="table table-hover" data-url="{{ route('managementTables.index') }}">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div class="tab-pane fade" id="ext_disposition" role="tabpanel" aria-labelledby="ext_disposition">
                        <form action="{{ route('extDisposition.store') }}" id="registerDispFinalExtForm" method="POST">
                            @csrf
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label for="inputNameFinalDisp">Agregar Diposición Final Externa: </label>
                                    <div class="input-group">
                                        <input id="inputNameFinalDisp" name="name" class="form-control"
                                            type="text" placeholder="Nombre de disposición final" required>
                                        <div class="input-group-prepend">
                                            <button type="submit" class="btn btn-primary btn-save">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                                <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <table id="final_disp_table" class="table table-hover" data-url="{{ route('managementTables.index') }}">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div class="tab-pane fade" id="disposition_place" role="tabpanel" aria-labelledby="disposition_place">
                        <form action="{{ route('dispPlace.store') }}" id="registerDispPlaceExtForm" method="POST">
                            @csrf
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label for="inputNameDispPlace">Agregar lugar de disposición: </label>
                                    <div class="input-group">
                                        <input id="inputNameDispPlace" name="name" class="form-control"
                                            type="text" placeholder="Nombre de lugar de disposición" required>
                                        <div class="input-group-prepend">
                                            <button type="submit" class="btn btn-primary btn-save">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                                <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <table id="disp_place_table" class="table table-hover" data-url="{{ route('managementTables.index') }}">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
@endsection


@section('extra-scripts')
    <script type="module"
        src="{{ asset('assets/principal/js/mangements_table.js') }}?v={{ filemtime(public_path('assets/principal/js/mangements_table.js')) }}">
    </script>
@endsection
