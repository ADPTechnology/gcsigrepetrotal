@extends('principal.common.layouts.masterpage')

@section('content')
    <div class="row content">

        <div class="title-page-header">
            <div class="card page-title-container">
                <div class="card-header">
                    <div class="total-width-container">
                        <h4>Administración Internamiento</h4>
                    </div>
                </div>
            </div>

            <div class="principal-container card-body card z-index-2">

                <div class="mb-4" id="btn-register-interment-guide-container"
                    data-url="{{ route('loadGuidesSelected.manager') }}">

                    <button id="btn-register-intguide-modal" class="btn btn-primary" data-url="{{ route('guides.create') }}">
                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Agregar Internamiento </span>
                        <i class="fa-solid fa-spinner fa-spin loadSpinner"></i>
                    </button>

                </div>

                <div class="d-flex justify-content-between flex-wrap">

                    <div class="group-filter-buttons-section mr-3">
                        <input type="hidden" id="max_date" name="max_date" value="{{ $max_date }}">
                        <input type="hidden" id="min_date" name="min_date" value="{{ $min_date }}">


                        <div class="datepicker-range-container input-daterange input-group" id="datepicker">

                            <span class="datepicker-label">
                                Desde:
                            </span>

                            <input type="text" class="input-sm form-control" name="fromDate" id="fromDateSelect" />

                            <span class="datepicker-label">
                                Hasta:
                            </span>

                            <input type="text" class="input-sm form-control" name="toDate" id="toDateSelect" />

                        </div>
                    </div>

                    <div>
                        <div class="form-group p-0 d-flex align-items-center">
                            <label class="text-nowrap mr-1 mb-0">Total (Kg): </label>
                            <input data-url="{{ route('generatedWastes.totalWeight') }}" class="form-control disabled"
                                id="total_weight_count_internment" type="text" readonly
                                style="pointer-events: none; min-width: max-content;">
                        </div>
                    </div>

                </div>


                <form>

                    <div id="filters-container" class="group-filter-buttons-section">

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Punto Verde</label>

                            <div>
                                <select name="warehouse" class="form-control select2 waste_internment_select"
                                    id="waste_warehouse_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>


                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Empresa</label>

                            <div>
                                <select name="company" class="form-control select2 waste_internment_select"
                                    id="waste_company_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Código</label>

                            <div>
                                <select name="code" class="form-control select2 waste_internment_select"
                                    id="waste_code_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>

                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Residuo</label>

                            <div>
                                <select name="wastetype" class="form-control select2 waste_internment_select"
                                    id="waste_wastetype_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>


                        <div class="form-group col-2 p-0 select-group">
                            <label class="form-label">Grupo</label>

                            <div>
                                <select name="group" class="form-control select2 waste_internment_select"
                                    id="waste_group_select" data-url="{{ route('getFilters.index') }}">
                                </select>
                            </div>
                        </div>
                    </div>

                </form>



                <div class="d-flex" id="form-generated-wastes-container">

                    <form action="{{ route('generatedWastesAdmin.export') }}" id="form-generated-wastes-export"
                        method="GET">
                        <input type="hidden" name="from_date" value="">
                        <input type="hidden" name="end_date" value="">
                        <input type="hidden" name="warehouse">
                        <input type="hidden" name="company">
                        <input type="hidden" name="code">
                        <input type="hidden" name="wastetype">
                        <input type="hidden" name="group">
                        <input type="hidden" name="user_name" value="{{ Auth::user()->name }}">

                        <div class="mb-4">
                            <button type="submit" class="btn btn-success" id="btn-export-profile-surveys">
                                <i class="fa-solid fa-download"></i> &nbsp; Descargar Excel
                                <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                            </button>
                        </div>
                    </form>

                    {{-- <form action="{{ route('generatedWastesAdmin.exportGeneral') }}" method="GET">
                    <input type="hidden" name="from_date" value="">
                    <input type="hidden" name="end_date" value="">
                    <input type="hidden" name="user_name" value="{{ Auth::user()->name }}">

                    <div class="mb-4 ms-3">
                        <button type="submit" class="btn btn-success">
                            <i class="fa-solid fa-file-export"></i> &nbsp; Descargar reporte general
                            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                        </button>
                    </div>
                </form> --}}

                </div>

                <table id="generated-wastes-table-admin" class="table table-hover"
                    data-url="{{ route('generatedWastesAdmin.index') }}">
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Nro. de Guía</th>
                            <th>Fecha</th>
                            <th>Punto Verde</th>
                            <th>Lote</th>
                            <th>Locación</th>
                            <th>Actividad</th>
                            <th>Área</th>
                            <th>Empresa</th>
                            <th>Código</th>
                            <th>Residuo</th>
                            <th>Clase</th>
                            <th>Grupo</th>
                            <th>Gestión</th>
                            <th>Peso (kg)</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

    </div>
@endsection

@section('modals')

    @include('principal.viewManager.packingGuides.partials.modals._show-internment-guide')

    @include('principal.viewAdmin.generatedWastes.partials.modals._edit')
    @include('principal.viewAdmin.generatedWastes.partials.modals._create')
@endsection
