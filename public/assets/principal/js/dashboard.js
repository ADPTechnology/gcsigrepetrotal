$(() => {

    function formatNumber(value, delimiter = null) {
        return value.toLocaleString('en-US')
        // return value.toString().replace(new RegExp("(^\\d{"+(value.toString().length%3||-1)+"})(?=\\d{3})"),"$1"+delimiter).replace(/(\d{3})(?=\d)/g,"$1"+delimiter)
    }

    function generateSequentialColors(baseColor, count) {
        const colors = [];
        const [h, s, l] = baseColor;

        for (let i = 0; i < count; i++) {
            const hueVariation = h - i * 10;
            const saturationVariation = Math.max(50, s - i * 3);
            const lightnessVariation = Math.min(80, l + i * 5);
            colors.push(`hsl(${hueVariation}, ${saturationVariation}%, ${lightnessVariation}%)`);
        }

        return colors;
    }

    const BASECOLOR = [208, 79, 41];

    var input_max_date = $('input#max_date').val()
    var input_min_date = $('input#min_date').val()

    var containerDaterange = $('.datepicker-range-container.input-daterange')
    containerDaterange.datepicker({
        language: 'es',
        orientation: "bottom auto"
    })

    var fromDatepickerinput = $('#fromDateSelect')
    var toDatepickerinput = $('#toDateSelect')

    containerDaterange.find('input[name=fromDate]').each(function () {
        let datepicker = $(this)
        datepicker.datepicker('setDate', new Date(input_min_date))
    })
    containerDaterange.find('input[name=toDate]').each(function () {
        let datepicker = $(this)
        datepicker.datepicker('setDate', new Date(input_max_date))
    })

    // var end = moment(input_max_date, "YYYY-MM-DD HH:mm:ss").add(1, 'days');
    // var start = moment(input_min_date, "YYYY-MM-DD HH:mm:ss")

    // function cb(start, end) {
    //     $('#reportrange_input').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
    // }

    // $('#reportrange').daterangepicker({
    //     startDate: start,
    //     endDate: end,
    //     // ranges: {
    //     //     // 'Todo': [start, end],
    //     //     // 'Hoy': [moment(), moment().add(1, 'days')],
    //     //     // 'Ayer': [moment().subtract(1, 'days'), moment()],
    //     //     // 'Últimos 7 días': [moment().subtract(6, 'days'), moment().add(1, 'days')],
    //     //     // 'Últimos 30 días': [moment().subtract(29, 'days'), moment().add(1, 'days')],
    //     //     // 'Este mes': [moment().startOf('month'), moment().endOf('month').add(1, 'days')],
    //     //     // 'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'days')]
    //     // },
    //     showDropdowns: true,

    // }, cb);

    // cb(start, end);

    $('#type_class_month_picker').datepicker({
        format: "MM - yyyy",
        startView: "months",
        minViewMode: "months",
        autoclose: true,
        clearBtn: true,
        language: 'es'
    });

    // var year_select = $('select#year_dashboard_select')
    // var months_select = $('select#months_dashboard_select')

    // year_select.select2({
    //     minimumResultsForSearch: -1
    // })

    // months_select.select2({
    //     closeOnSelect: false
    // })

    var form = $('#dashboard_filters_action')
    var index_url = form.attr('action')

    var CHART_0
    var CHART_1
    var CHART_2
    var CHART_3
    var CHART_4
    var CHART_5
    var CHART_6
    var CHART_7

    function loadDashboardData() {

        $.ajax({
            url: index_url,
            method: 'GET',
            data: {
                min_date: moment(fromDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'),
                max_date: moment(toDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'),
                type: 'all'
            },
            dataType: 'JSON',
            success: function (data) {

                var totalizer_cont = $('.totalize-cont')
                var total = data.totalizer

                totalizer_cont.html(total)
                totalizer_cont.prettynumber({
                    delimiter: ','
                })
                total = totalizer_cont.html() + ' TN'
                totalizer_cont.html(total)

                // * ---- 0 GRÁFICO ------ */

                let data_0 = data.data_0

                CHART_0 = new Chart(
                    document.getElementById('daily_month_chart_object'),
                    {
                        type: 'bar',
                        data: {
                            labels: data_0.map(row => row.date),
                            datasets: [
                                {
                                    label: 'Generación diaria por mes (Tn)',
                                    data: data_0.map(row => row.amount)
                                }
                            ]
                        },
                        options: {
                            layout: {
                                padding: {
                                    top: 25,
                                    left: 25,
                                    right: 25
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                    anchor: 'end',
                                    align: 'top',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',') + ' Tn'
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    }
                )

                // *----- 1 GRÁFICO ------ */

                let data_1 = data.data_1

                CHART_1 = new Chart(
                    document.getElementById('month_chart_object'),
                    {
                        type: 'bar',
                        data: {
                            labels: data_1.map(row => row.month),
                            datasets: [
                                {
                                    label: 'Generación por mes (Tn)',
                                    data: data_1.map(row => row.amount)
                                }
                            ]
                        },
                        options: {
                            layout: {
                                padding: {
                                    top: 25
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                    anchor: 'end',
                                    align: 'top',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',') + ' Tn'
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    }
                );

                // *----- 2 GRÁFICO ------ */

                let data_2 = data.data_2

                CHART_2 = new Chart(
                    document.getElementById('lot_chart_object'),
                    {
                        type: 'doughnut',
                        data: {
                            labels: data_2.map(row => row.lote),
                            datasets: [
                                {
                                    label: 'Generación por Lote (Kg)',
                                    data: data_2.map(row => row.amount)
                                }
                            ],
                            hoverOffset: 4
                        },
                        options: {
                            plugins: {
                                datalabels: {
                                    anchor: 'center',
                                    align: 'end',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',')
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    }
                );

                // *----- 3 GRÁFICO ------ */

                // let data_3 = data.data_3

                // CHART_3 = new Chart(
                //     document.getElementById('stage_chart_object'),
                //     {
                //         type: 'bar',
                //         data: {
                //             labels: data_3.map(row => row.stage),
                //             datasets: [
                //                 {
                //                     label: 'Generación por Etapa',
                //                     data: data_3.map(row => row.amount)
                //                 }
                //             ]
                //         },
                //         options: {
                //             layout: {
                //                 padding: {
                //                     top: 25
                //                 }
                //             },
                //             plugins: {
                //                 legend: {
                //                     display: false,
                //                 },
                //                 datalabels: {
                //                     anchor: 'end',
                //                     align: 'top',
                //                     color: '#000',
                //                     font: {
                //                         weight: 'bold'
                //                     },
                //                     formatter: (value) => formatNumber(value, ',') + ' Tn'
                //                 }
                //             }
                //         },
                //         plugins: [ChartDataLabels]
                //     }
                // );


                // *----- 4 GRÁFICO ------ */

                let data_4 = data.data_4

                let data_4_container = $('#project_chart_container')
                let data_4_length = data_4.length
                let heigth_4 = data_4_length * 27

                data_4_container.height(heigth_4)

                CHART_4 = new Chart(
                    document.getElementById('project_chart_object'),
                    {
                        type: 'bar',
                        data: {
                            labels: data_4.map(row => row.project),
                            datasets: [
                                {
                                    label: 'Generación por Área / Proyecto (Kg)',
                                    data: data_4.map(row => row.amount)
                                }
                            ]
                        },
                        options: {
                            layout: {
                                padding: {
                                    right: 50
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                    anchor: 'end',
                                    align: 'end',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',')
                                }
                            },
                            indexAxis: 'y',
                        },
                        plugins: [ChartDataLabels]
                    }
                )


                // *----- 5 GRÁFICO ------ */

                let data_5 = data.data_5

                let data_5_container = $('#company_chart_container')
                let data_5_length = data_5.length
                let heigth_5 = data_5_length * 27

                data_5_container.height(heigth_5)

                CHART_5 = new Chart(
                    document.getElementById('company_chart_object'),
                    {
                        type: 'bar',
                        data: {
                            labels: data_5.map(row => row.company),
                            datasets: [
                                {
                                    label: 'Generación por Empresa (Kg)',
                                    data: data_5.map(row => row.amount),
                                }
                            ]
                        },
                        options: {
                            layout: {
                                padding: {
                                    right: 50
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                    anchor: 'end',
                                    align: 'end',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',')
                                }
                            },
                            indexAxis: 'y',
                        },
                        plugins: [ChartDataLabels]
                    }
                )

                // *----- 6 GRÁFICO ------ */

                let data_6 = data.data_6

                let data_6_container = $('#group_chart_container')
                let data_6_length = data_6.length
                let heigth_6 = data_6_length * 30

                data_6_container.height(heigth_6)

                let colors_6 = generateSequentialColors(BASECOLOR, data_6_length)

                CHART_6 = new Chart(
                    document.getElementById('class_chart_object'),
                    {
                        type: 'bar',
                        data: {
                            labels: ['Tn'],
                            datasets: data_6.map(function (row, index) {
                                return {
                                    label: row.group,
                                    data: [row.amount],
                                    backgroundColor: colors_6[index],
                                }
                            })
                        },
                        options: {
                            layout: {
                                padding: {
                                    right: 50
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                },
                                datalabels: {
                                    anchor: 'end',
                                    align: 'end',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',')
                                }
                            },
                            indexAxis: 'y',
                        },
                        plugins: [ChartDataLabels]
                    }
                )


                // *----- 7 GRÁFICO ------ */

                let data_7 = data.data_7

                let data_7_container = $('#waste_chart_container')
                let data_7_length = data_7.length
                let heigth_7 = data_7_length * 27

                data_7_container.height(heigth_7)

                CHART_7 = new Chart(
                    document.getElementById('waste_chart_object'),
                    {
                        type: 'bar',
                        data: {
                            labels: data_7.map(row => row.waste),
                            datasets: [
                                {
                                    label: 'Generación por Tipo de Residuo (Kg)',
                                    data: data_7.map(row => row.amount)
                                }
                            ]
                        },
                        options: {
                            layout: {
                                padding: {
                                    right: 50
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                    anchor: 'end',
                                    align: 'end',
                                    color: '#000',
                                    font: {
                                        weight: 'bold'
                                    },
                                    formatter: (value) => formatNumber(value, ',')
                                }
                            },
                            indexAxis: 'y',
                        },
                        plugins: [ChartDataLabels]
                    }
                )

            },
            error: function (data) {
                console.log(data)
            }
        })
    }

    loadDashboardData()

    // year_select.on('change', function (e) {

    //     value = $(this).val()

    //     $.ajax({
    //         method: 'GET',
    //         url: $(this).data('url'),
    //         data: {
    //             year: value
    //         },
    //         dataType: 'JSON',
    //         success: function (data) {

    //             months_select.html(data.html)

    //             months_select.select2({
    //                 closeOnSelect: false
    //             })
    //         },
    //         error: function (data) {
    //             console.log(data)
    //         }
    //     })
    // })


    // ------ UPDATE CHART ------------

    function updateChart(chart, labels, data) {

        chart.data.labels = labels;
        chart.data.datasets.forEach((dataset) => {
            dataset.data = data;
        });

        chart.update()
    }

    form.on('submit', function (e) {
        e.preventDefault()

        var form = $(this)
        var button = form.find('.btn-save')
        var spinner = button.find('.loadSpinner')

        button.attr('disabled', 'disabled')
        spinner.addClass('active')

        $('input#min_date').val(moment(fromDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'))
        $('input#max_date').val(moment(toDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'))

        var type_class_date_str = $('#type_class_month_picker').datepicker('getDate')
        var form_serialized_data = form.serialize()

        form_serialized_data += "&type=all"

        if (type_class_date_str != null) {

            var type_class_date = new Date(type_class_date_str)
            var tc_select_year = type_class_date.getFullYear()
            var tc_select_month = String(type_class_date.getMonth() + 1).padStart(2, '0')
            var tc_select_day = String(type_class_date.getDate()).padStart(2, '0')

            var tc_format_date = `${tc_select_year}-${tc_select_month}-${tc_select_day}`

            form_serialized_data += `&type_class_date=${encodeURIComponent(tc_format_date)}`
        }

        $.ajax({
            method: 'GET',
            url: form.attr('action'),
            data: form_serialized_data,
            dataType: 'JSON',
            success: function (data) {

                var totalizer_cont = $('.totalize-cont')
                var total = data.totalizer

                totalizer_cont.html(total)
                totalizer_cont.prettynumber({
                    delimiter: ','
                })
                total = totalizer_cont.html() + ' TN'
                totalizer_cont.html(total)

                // * ----- CHART 0 -------
                let data_0 = data.data_0
                let labels_0 = data_0.map(row => row.date)
                let dataset_0 = data_0.map(row => row.amount)
                updateChart(CHART_0, labels_0, dataset_0)


                // * ----- CHART 1 -------

                let data_1 = data.data_1
                let labels_1 = data_1.map(row => row.month)
                let dataset_1 = data_1.map(row => row.amount)
                updateChart(CHART_1, labels_1, dataset_1)

                // * ----- CHART 2 ------

                let data_2 = data.data_2
                let labels_2 = data_2.map(row => row.lote)
                let dataset_2 = data_2.map(row => row.amount)
                updateChart(CHART_2, labels_2, dataset_2)

                // * ----- CHART 3 -------

                // let data_3 = data.data_3
                // let labels_3 = data_3.map(row => row.stage)
                // let dataset_3 = data_3.map(row => row.amount)
                // updateChart(CHART_3, labels_3, dataset_3)

                // * ----- CHART 4 -------

                let data_4 = data.data_4
                let labels_4 = data_4.map(row => row.project)
                let dataset_4 = data_4.map(row => row.amount)

                let data_4_container = $('#project_chart_container')
                let data_4_length = data_4.length
                let heigth_4 = data_4_length * 27
                data_4_container.height(heigth_4)

                updateChart(CHART_4, labels_4, dataset_4)

                // * ----- CHART 5 -------

                let data_5 = data.data_5
                let labels_5 = data_5.map(row => row.company)
                let dataset_5 = data_5.map(row => row.amount)

                let data_5_container = $('#company_chart_container')
                let data_5_length = data_5.length
                let heigth_5 = data_5_length * 27
                data_5_container.height(heigth_5)

                updateChart(CHART_5, labels_5, dataset_5)

                // * ----- CHART 6 -------

                let data_6 = data.data_6
                let data_6_length = data_6.length
                let heigth_6 = data_6_length * 27

                let colors_6 = generateSequentialColors(BASECOLOR, data_6_length)

                let dataset_6 = data_6.map(function (row, index) {
                    return {
                        label: row.group,
                        data: [row.amount],
                        backgroundColor: colors_6[index]
                    }
                })

                let data_6_container = $('#group_chart_container')

                data_6_container.height(heigth_6)
                CHART_6.data.datasets = dataset_6
                CHART_6.update()
                // updateChart(CHART_6, labels_6, dataset_6)

                // * ----- CHART 7 -------

                let data_7 = data.data_7
                let labels_7 = data_7.map(row => row.waste)
                let dataset_7 = data_7.map(row => row.amount)

                let data_7_container = $('#waste_chart_container')
                let data_7_length = data_7.length
                let heigth_7 = data_7_length * 27
                data_7_container.height(heigth_7)

                updateChart(CHART_7, labels_7, dataset_7)

            },
            complete: function (data) {
                button.removeAttr('disabled')
                spinner.removeClass('active')
            },
            error: function (data) {
                console.log(data)
            }
        })
    })



    // * ---- Load 6 chart ------

    $('html').on('click', '#btn-save-chart6', function () {

        let button = $(this)

        if (!button.prop('disabled')) {

            let form = $('#dashboard_filters_action')
            var spinner = button.find('.loadSpinner')

            button.attr('disabled', 'disabled')
            spinner.addClass('active')

            // TODO : CAMBIAR

            $('input#min_date').val(moment(fromDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'))
            $('input#max_date').val(moment(toDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'))

            var type_class_date_str = $('#type_class_month_picker').datepicker('getDate')
            var form_serialized_data = form.serialize()

            form_serialized_data += "&type=6"

            if (type_class_date_str != null) {

                var type_class_date = new Date(type_class_date_str)
                var tc_select_year = type_class_date.getFullYear()
                var tc_select_month = String(type_class_date.getMonth() + 1).padStart(2, '0')
                var tc_select_day = String(type_class_date.getDate()).padStart(2, '0')
                var tc_format_date = `${tc_select_year}-${tc_select_month}-${tc_select_day}`

                form_serialized_data += `&type_class_date=${encodeURIComponent(tc_format_date)}`
            }

            $.ajax({
                method: 'GET',
                url: form.attr('action'),
                data: form_serialized_data,
                dataType: 'JSON',
                success: function (data) {

                    // * ----- CHART 6 -------

                    let data_6 = data.data_6
                    let data_6_length = data_6.length
                    let heigth_6 = data_6_length * 27

                    let colors_6 = generateSequentialColors(BASECOLOR, data_6_length)

                    let dataset_6 = data_6.map(function (row, index) {
                        return {
                            label: row.group,
                            data: [row.amount],
                            backgroundColor: colors_6[index]
                        }
                    })

                    let data_6_container = $('#group_chart_container')

                    data_6_container.height(heigth_6)
                    CHART_6.data.datasets = dataset_6
                    CHART_6.update()
                },
                complete: function (data) {
                    button.removeAttr('disabled')
                    spinner.removeClass('active')
                },
                error: function (data) {
                    console.log(data)
                }
            })
        }
    })

})
