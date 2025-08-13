<div class="container-create-guide card-body card z-index-2">

    <div class="code-container mb-4">
        GUÍA DE INTERNAMIENTO Nro:
        <span class="code-txt">
            {{ $guide_code }}
        </span>
    </div>

    <div class="mb-4">

        <div class="select-warehouse-guide-container">

            <div class="form-group col-md-12 inner-box-select-warehouse">
                <label for="guide-warehouse-select">Punto verde *</label>
                <select data-url="{{ route('guides.getDataWarehouse') }}" name="select-warehouse"
                    id="guide-warehouse-select" class="form-control select2 required-input">
                    <option></option>
                    @foreach ($warehouses as $warehouse)
                        <option value="{{ $warehouse->id }}"> {{ $warehouse->name }} </option>
                    @endforeach
                </select>
            </div>

        </div>

        <div class="description-guide-title">
            Descripción de procedencia
        </div>

        <div class="form-row flex-nowrap" id="selects-container-register-guide">
            <div class="form-group col-md-2">
                <span class="guide-warehouse-info-dis">LOTE</span>

                <input id="guide-lot-dis" type="text" class="form-control" disabled>

            </div>


            <div class="form-group col-md-2">
                <span class="guide-warehouse-info-dis">LOCACIÓN</span>
                <input id="guide-location-dis" type="text" class="form-control" disabled>
            </div>

            <div class="form-group col-md-3">
                <span class="guide-warehouse-info-dis">ACTIVIDAD</span>
                <input id="guide-activity-dis" type="text" class="form-control" disabled>
            </div>

            <div class="form-group col-md-2">
                <span class="guide-warehouse-info-dis">ÁREA</span>
                <input id="guide-proyect-dis" type="text" class="form-control" disabled>
            </div>

            <div class="form-group col-md-3">
                <span class="guide-warehouse-info-dis">EMPRESA</span>
                <input id="guide-company-dis" type="text" class="form-control" disabled>
            </div>


        </div>

        <div class="divider-bottom-select">
        </div>


        <div class="select-class-guide-container mt-3">

            <div class="form-group select-container-ClassWaste inner-box-select-warehouse">
                <label for="guide-wasteClass-select">Clase de residuo *</label>
                <select data-url="{{ route('guides.getDataWarehouse') }}" id="guide-wasteClass-select"
                    class="form-control select2">
                    <option value=""></option>
                    @foreach ($wasteClasses as $wasteClass)
                        <option value="{{ $wasteClass->id }}"> {{ $wasteClass->symbol }} </option>
                    @endforeach
                </select>
            </div>

            <div class="form-group ms-3 waste-type-select-container">
                <label for="guide-wasteTypes-select">Tipos de residuo *</label>
                <select id="guide-wasteTypes-select" class="form-control select2" multiple>
                </select>
            </div>

            <div class="form-group ms-3 save-btn-classWaste-guide-container">
                <button class="btn btn-primary" id="btn-save-classWaste-guide"
                    data-url="{{ route('guides.getDataWarehouse') }}">
                    <i class="fa-solid fa-square-plus"></i> &nbsp;
                    Agregar
                </button>
            </div>
        </div>


        <table class="table table-hover">
            <thead>
                <tr>
                    <th class="classSymbol-guide" scope="col">CLASE</th>
                    <th class="nameWasteType-guide" scope="col">NOMBRE/TIPO DE RESIDUO</th>
                    <th scope="col">PESO (Kg)</th>
                    {{-- <th scope="col">N° DE BULTOS</th> --}}
                    <th scope="col" class="package-type-th">GESTIÓN</th>
                    <th scope="col">Borrar</th>
                </tr>
            </thead>
            <tbody id="table-classTypes-body">

                <tr id="row-info-total-guide">
                    <td></td>
                    <td class="text-right">Total Peso:</td>
                    <td id="info-total-weight">0.00</td>
                    {{-- <td id="info-package-quantity">0</td> --}}
                    <td></td>
                    <td></td>
                </tr>
            </tbody>


        </table>

        <div class="divider-bottom-select">
        </div>

        <div class="guide-comment-container mt-3">
            <label for="guide-comment">Observaciones y/o aclaraciones (opcional): </label>
            <textarea class="form-control" name="guide-comment" id="guide-comment" cols="30" rows="10"></textarea>
        </div>

    </div>

</div>
