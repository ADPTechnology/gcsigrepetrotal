@extends('principal.common.layouts.masterpage')

@section('content')


<div class="row content">

    <div class="title-page-header">
        <div class="card page-title-container">
            <div class="card-header">
                <div class="total-width-container">
                    <h4>Guías aprobadas</h4>
                </div>
            </div>
        </div>

        <div class="principal-container card-body card z-index-2">


            <div class="d-flex">

                <form action="{{ route('internmentGuidesApproved.export') }}" id="form-guides-approved-export" method="GET">

                    <div class="mb-4">
                        <button type="submit" class="btn btn-success" id="btn-export-profile-surveys">
                            <i class="fa-solid fa-download"></i> &nbsp; Descargar Excel
                            <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                        </button>
                    </div>

                </form>

            </div>

            <table id="guide-approved-table-admin" class="table table-hover" data-url="{{route('guidesAdmin.index')}}">
                <thead>
                    <tr class="approved-guides-table-head">
                        <th>Nro de Guía</th>
                        <th>Fecha de solicitud</th>
                        <th>Lote</th>
                        <th>Etapa</th>
                        <th>Locación</th>
                        <th>Area / Proyecto</th>
                        <th>Empresa</th>
                        <th>Frente</th>
                        <th>Estado Aprobado</th>
                        <th>Estado Recepcionado</th>
                        <th>Estado Verificado</th>
                        <th>Ver</th>
                        <th class="text-center">Generar PDF</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

</div>

@endsection
