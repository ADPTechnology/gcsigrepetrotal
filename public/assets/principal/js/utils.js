const dateRangeConfig = {
    locale: { format: 'DD-MM-YYYY' },
    drops: 'down',
    opens: 'right',
    ranges: {
        'Todo': [moment(), moment()],
        'Hoy': [moment(), moment().add(1, 'days')],
        'Ayer': [moment().subtract(1, 'days'), moment()],
        'Últimos 7 días': [moment().subtract(6, 'days'), moment().add(1, 'days')],
        'Últimos 30 días': [moment().subtract(29, 'days'), moment().add(1, 'days')],
        'Este mes': [moment().startOf('month'), moment().endOf('month').add(1, 'days')],
        'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'days')],
    },
    startDate: moment(),
    endDate: moment()
}

function InitAjaxSelect2(ele_class, config = {}, TEXT, DATA = {}) {
    $(ele_class).each(function () {
        let select_cnf = {
            dropdownParent: $(this).closest("form"),
            language: {
                noResults: function () {
                    return "No se encontraron resultados";
                },
                searching: function () {
                    return "Buscando...";
                },
            },
        };

        for (let key in config) {
            select_cnf[key] = config[key];
        }

        select_cnf["ajax"] = {
            url: $(this).data("url"),
            dataType: "JSON",
            data: function (params) {
                let query = {
                    search: params.term,
                    ...DATA
                }
                return query
            },
            delay: 300,
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item[TEXT],
                            id: item.id,
                        };
                    }),
                };
            },
        };

        $(this).select2(select_cnf);
    });
}

export { dateRangeConfig, InitAjaxSelect2 }
