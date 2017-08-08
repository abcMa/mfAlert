var hcThemes = {};
hcThemes = {
    changeTheme: function (options) {
        switch (options.type) {
            case "ipPrimary":
                Highcharts.theme = {
                    colors: [
                        '#5cd2fc'
                    ]
                }
                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
            case "ipCusLight":
                Highcharts.theme = {
                    colors: [
                        '#5eb4ef', '#ffd777', '#6fcdcd', '#ff829d', '#ff9f40'
                    ]
                }
                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
            case "ipCusLight_OD":
                Highcharts.theme = {
                    colors: [
                        '#91c7ae', '#8eaabe', '#ffe1ba', '#ffcdba', '#ffcbcb', '#bee4ff', '#beffe7',
                        '#bad9ff', '#ffe1ba', '#baf4ff', '#ffcbe8'
                    ]
                }
                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
            case "ipCusDeep":
                Highcharts.theme = {
                    colors: [
                        '#c23531', '#c27431', '#1e7175', '#27992e', '#c2b931', '#31c283', '#751e22',
                        '#31afc2', '#3186c2', '#1e4b75', '#ae2760'
                    ]
                }
                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
            case "dark":
                Highcharts.theme = {
                    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                        '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
                    ],
                    chart: {
                        backgroundColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 1,
                                y2: 1
                            },
                            stops: [
                                [0, '#2a2a2b'],
                                [1, '#3e3e40']
                            ]
                        },
                        style: {
                            fontFamily: '\'Unica One\', sans-serif'
                        },
                        plotBorderColor: '#606063'
                    },
                    title: {
                        style: {
                            color: '#E0E0E3',
                            textTransform: 'uppercase',
                            fontSize: '20px'
                        }
                    },
                    subtitle: {
                        style: {
                            color: '#E0E0E3',
                            textTransform: 'uppercase'
                        }
                    },
                    xAxis: {
                        gridLineColor: '#707073',
                        labels: {
                            style: {
                                color: '#E0E0E3'
                            }
                        },
                        lineColor: '#707073',
                        minorGridLineColor: '#505053',
                        tickColor: '#707073',
                        title: {
                            style: {
                                color: '#A0A0A3'

                            }
                        }
                    },
                    yAxis: {
                        gridLineColor: '#707073',
                        labels: {
                            style: {
                                color: '#E0E0E3'
                            }
                        },
                        lineColor: '#707073',
                        minorGridLineColor: '#505053',
                        tickColor: '#707073',
                        tickWidth: 1,
                        title: {
                            style: {
                                color: '#A0A0A3'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        style: {
                            color: '#F0F0F0'
                        }
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                color: '#B0B0B3'
                            },
                            marker: {
                                lineColor: '#333'
                            }
                        },
                        boxplot: {
                            fillColor: '#505053'
                        },
                        candlestick: {
                            lineColor: 'white'
                        },
                        errorbar: {
                            color: 'white'
                        }
                    },
                    legend: {
                        itemStyle: {
                            color: '#E0E0E3'
                        },
                        itemHoverStyle: {
                            color: '#FFF'
                        },
                        itemHiddenStyle: {
                            color: '#606063'
                        }
                    },
                    credits: {
                        style: {
                            color: '#666'
                        }
                    },
                    labels: {
                        style: {
                            color: '#707073'
                        }
                    },

                    drilldown: {
                        activeAxisLabelStyle: {
                            color: '#F0F0F3'
                        },
                        activeDataLabelStyle: {
                            color: '#F0F0F3'
                        }
                    },

                    navigation: {
                        buttonOptions: {
                            symbolStroke: '#DDDDDD',
                            theme: {
                                fill: '#505053'
                            }
                        }
                    },

                    // scroll charts
                    rangeSelector: {
                        buttonTheme: {
                            fill: '#505053',
                            stroke: '#000000',
                            style: {
                                color: '#CCC'
                            },
                            states: {
                                hover: {
                                    fill: '#707073',
                                    stroke: '#000000',
                                    style: {
                                        color: 'white'
                                    }
                                },
                                select: {
                                    fill: '#000003',
                                    stroke: '#000000',
                                    style: {
                                        color: 'white'
                                    }
                                }
                            }
                        },
                        inputBoxBorderColor: '#505053',
                        inputStyle: {
                            backgroundColor: '#333',
                            color: 'silver'
                        },
                        labelStyle: {
                            color: 'silver'
                        }
                    },

                    navigator: {
                        handles: {
                            backgroundColor: '#666',
                            borderColor: '#AAA'
                        },
                        outlineColor: '#CCC',
                        maskFill: 'rgba(255,255,255,0.1)',
                        series: {
                            color: '#7798BF',
                            lineColor: '#A6C7ED'
                        },
                        xAxis: {
                            gridLineColor: '#505053'
                        }
                    },

                    scrollbar: {
                        barBackgroundColor: '#808083',
                        barBorderColor: '#808083',
                        buttonArrowColor: '#CCC',
                        buttonBackgroundColor: '#606063',
                        buttonBorderColor: '#606063',
                        rifleColor: '#FFF',
                        trackBackgroundColor: '#404043',
                        trackBorderColor: '#404043'
                    },

                    // special colors for some of the
                    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                    background2: '#505053',
                    dataLabelsColor: '#B0B0B3',
                    textColor: '#C0C0C0',
                    contrastTextColor: '#F0F0F3',
                    maskColor: 'rgba(255,255,255,0.3)'
                };

                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
            case "sand":
                // Add the background image to the container
                Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
                    proceed.call(this);
                    this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
                });
                Highcharts.theme = {
                    colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                        '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
                    ],
                    chart: {
                        backgroundColor: null,
                        style: {
                            fontFamily: 'Signika, serif'
                        }
                    },
                    title: {
                        style: {
                            color: 'black',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }
                    },
                    subtitle: {
                        style: {
                            color: 'black'
                        }
                    },
                    tooltip: {
                        borderWidth: 0
                    },
                    legend: {
                        itemStyle: {
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }
                    },
                    xAxis: {
                        labels: {
                            style: {
                                color: '#6e6e70'
                            }
                        }
                    },
                    yAxis: {
                        labels: {
                            style: {
                                color: '#6e6e70'
                            }
                        }
                    },
                    plotOptions: {
                        series: {
                            shadow: true
                        },
                        candlestick: {
                            lineColor: '#404048'
                        },
                        map: {
                            shadow: false
                        }
                    },

                    // Highstock specific
                    navigator: {
                        xAxis: {
                            gridLineColor: '#D0D0D8'
                        }
                    },
                    rangeSelector: {
                        buttonTheme: {
                            fill: 'white',
                            stroke: '#C0C0C8',
                            'stroke-width': 1,
                            states: {
                                select: {
                                    fill: '#D0D0D8'
                                }
                            }
                        }
                    },
                    scrollbar: {
                        trackBorderColor: '#C0C0C8'
                    },

                    // General
                    background2: '#E0E0E8'

                };

                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
            case "grid":
                Highcharts.theme = {
                    colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                        '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
                    ],
                    chart: {
                        backgroundColor: null,
                        style: {
                            fontFamily: 'Dosis, sans-serif'
                        }
                    },
                    title: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }
                    },
                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'rgba(219,219,216,0.8)',
                        shadow: false
                    },
                    legend: {
                        itemStyle: {
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }
                    },
                    xAxis: {
                        gridLineWidth: 1,
                        labels: {
                            style: {
                                fontSize: '12px'
                            }
                        }
                    },
                    yAxis: {
                        minorTickInterval: 'auto',
                        title: {
                            style: {
                                textTransform: 'uppercase'
                            }
                        },
                        labels: {
                            style: {
                                fontSize: '12px'
                            }
                        }
                    },
                    plotOptions: {
                        candlestick: {
                            lineColor: '#404048'
                        }
                    },


                    // General
                    background2: '#F0F0EA'

                };

                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
                break;
        }
        Highcharts.setOptions({
            lang: {
                drillUpText: "◁ 返回"
            }
        });
    },
};