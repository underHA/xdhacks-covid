



// Globals.
const r = React;
const rd = ReactDOM;
const e = r.createElement;

document.addEventListener('DOMContentLoaded', () => {
  rd.render(e(App), document.getElementById('root'));
});

function App() {
  const defaultGroupByCountry = covidFilters.groupByCountry.defaultValue;
  const defaultSelectedTypes = covidFilters.selectedTypes.defaultValue;
  const defaultSelectedRegions = covidFilters.selectedRegions.defaultValue;
  const defaultUseLogScale = covidFilters.useLogScale.defaultValue;
  const defaultCountrySearchQuery = covidFilters.countrySearchQuery.defaultValue;
  const defaultDataSort = covidFilters.dataSort.defaultValue;
  const defaultDataSortDirection = covidFilters.dataSortDirection.defaultValue;

  const [covidData, setCovidData] = r.useState(null);
  const [covidDataByCountries, setCovidDataByCountries] = r.useState(null);
  const [errorMessage, setErrorMessage] = r.useState(null);

  const [groupByCountry, setGroupByCountry] = r.useState(defaultGroupByCountry);
  const [selectedTypes, setSelectedTypes] = r.useState(defaultSelectedTypes);
  const [selectedRegions, setSelectedRegions] = r.useState(defaultSelectedRegions);
  const [useLogScale, setUseLogScale] = r.useState(defaultUseLogScale);
  const [countrySearchQuery, setCountrySearchQuery] = r.useState(defaultCountrySearchQuery);

  const [dataSort, setDataSort] = r.useState(defaultDataSort);
  const [dataSortDirection, setDataSortDirection] = r.useState(defaultDataSortDirection);

  const onFiltersReset = () => {
    setGroupByCountry(defaultGroupByCountry);
    setSelectedTypes(defaultSelectedTypes);
    setSelectedRegions(defaultSelectedRegions);
    setUseLogScale(defaultUseLogScale);
    setCountrySearchQuery(defaultCountrySearchQuery);
    setDataSort(defaultDataSort);
    setDataSortDirection(defaultDataSortDirection);
    deleteFiltersFromUrl();
  };

  const onRegionChange = (changedRegionKey) => {
    let newRegions;
    if (selectedRegions.includes(changedRegionKey)) {
      newRegions = [...selectedRegions.filter(regionKey => regionKey !== changedRegionKey)];
      if (!newRegions.length) {
        newRegions = [covidCountries.all.key];
      }
    } else {
      newRegions = [...selectedRegions.filter(regionKey => regionKey !== covidCountries.all.key), changedRegionKey];
    }
    setSelectedRegions(newRegions);
    filterToUrl(covidFilters.selectedRegions.key, newRegions);
  };

  const onUseLogScale = (useLog) => {
    setUseLogScale(useLog);
    filterToUrl(covidFilters.useLogScale.key, useLog);
  };

  const onDataSort = (dataSortKey, dataSortDirectionKey) => {
    setDataSort(dataSortKey);
    setDataSortDirection(dataSortDirectionKey);
    filterToUrl(covidFilters.dataSort.key, dataSortKey);
    filterToUrl(covidFilters.dataSortDirection.key, dataSortDirectionKey);
  };

  const onTypeChange = (dataTypeKey) => {
    let newSelectedTypes;
    if (selectedTypes.includes(dataTypeKey)) {
      newSelectedTypes = [...selectedTypes.filter(dataType => dataType !== dataTypeKey)];
    } else {
      newSelectedTypes = [...selectedTypes, dataTypeKey];
    }
    setSelectedTypes(newSelectedTypes);
    filterToUrl(covidFilters.selectedTypes.key, newSelectedTypes);
  };

  const onCountrySearch = (query) => {
    const q = query || '';
    setCountrySearchQuery(q);
  };

  const onGroupByCountries = () => {
    const newGroupByCountry = !groupByCountry;
    setSelectedRegions(defaultSelectedRegions);
    setGroupByCountry(newGroupByCountry);
    filterToUrl(covidFilters.groupByCountry.key, newGroupByCountry);
    filterToUrl(covidFilters.selectedRegions.key, defaultSelectedRegions);
  };

  r.useEffect(() => {
    loadCovidData()
      .then((data) => {
        setCovidData(data);
        setCovidDataByCountries(groupCovidDataByCountries(data));
      })
      .catch(() => setErrorMessage('Cannot fetch the statistics data. It might be a network issue. Try to refresh the page.'));
  }, []);

  r.useEffect(() => {
    const populatedFilters = filtersFromUrl();

    if (populatedFilters.hasOwnProperty(covidFilters.groupByCountry.key)) {
      setGroupByCountry(populatedFilters[covidFilters.groupByCountry.key]);
    }

    if (populatedFilters.hasOwnProperty(covidFilters.useLogScale.key)) {
      setUseLogScale(populatedFilters[covidFilters.useLogScale.key]);
    }

    if (populatedFilters.hasOwnProperty(covidFilters.selectedTypes.key)) {
      setSelectedTypes(populatedFilters[covidFilters.selectedTypes.key]);
    }

    if (populatedFilters.hasOwnProperty(covidFilters.selectedRegions.key)) {
      setSelectedRegions(populatedFilters[covidFilters.selectedRegions.key]);
    }

    if (populatedFilters.hasOwnProperty(covidFilters.dataSort.key)) {
      setDataSort(populatedFilters[covidFilters.dataSort.key]);
    }

    if (populatedFilters.hasOwnProperty(covidFilters.dataSortDirection.key)) {
      setDataSortDirection(populatedFilters[covidFilters.dataSortDirection.key]);
    }
  }, []);

  if (errorMessage) {
    return e(ErrorMessage, {errorMessage});
  }
  if (!covidData || !covidDataByCountries) {
    return e(Spinner);
  }

  const covidDataInUse = groupByCountry ? covidDataByCountries : covidData;

  return (
    e('div', null,
      e('div', {className: 'mb-2'},
        e(LastUpdatedDate, {covidData})
      ),
      e('div', {className: 'mb-1'},
        e(DataTypes, {covidData: covidDataInUse, selectedRegions, selectedTypes, onTypeChange})
      ),
      e('div', {className: 'mb-4'},
        e(CovidChart, {covidData: covidDataInUse, regions: selectedRegions, selectedTypes, useLogScale})
      ),
      e('div', {className: 'mb-0'},
        e(TableFilters, {
          onFiltersReset,
          groupByCountry,
          onGroupByCountries,
          countrySearchQuery,
          onCountrySearch,
          useLogScale,
          onUseLogScale,
        })
      ),
      e('div', {className: 'mb-4'},
        e(RegionsTable, {
          groupByCountry,
          covidData: covidDataInUse,
          selectedRegions,
          onRegionChange,
          countrySearchQuery,
          dataSort,
          dataSortDirection,
          onDataSort,
        })
      ),
    )
  );
}

function LastUpdatedDate({covidData}) {
  const lastUpdatedDate = getLastUpdatedDate(covidData);
  return e('small', {className: 'text-dark'},
    'Last updated: ',
    e('span', {className: 'badge badge-dark'}, lastUpdatedDate)
  );
}

function DataTypes({covidData, selectedRegions, selectedTypes, onTypeChange}) {
  const dataTypes = Object.values(covidDataTypes).map(dataType => {
    const checked = !!selectedTypes.includes(dataType.key);
    return e(DataType, {key: dataType.key, covidData, selectedRegions, dataType, checked, onTypeChange})
  });
  return e('form', {className: 'form-inline'}, dataTypes);
}

function DataType({covidData, selectedRegions, dataType, checked, onTypeChange}) {
  const alertClass = covidDataTypes[dataType.key].alertClass;
  const badgeClass = covidDataTypes[dataType.key].badgeClass;
  const totalCount = getTotalCount(covidData, dataType.key, selectedRegions);
  const onChange = () => {
    onTypeChange(dataType.key);
  };
  return (
    e('label', {className: `alert ${alertClass} mr-3 mb-3`},
      e('div', {className: 'form-group form-check mb-0'},
        e('input', {type: 'checkbox', className: 'form-check-input', checked, onChange}),
        e('div', {className: 'form-check-label'},
          dataType.title,
          e('span', {className: `badge ${badgeClass} ml-2`}, totalCount.toLocaleString())
        )
      )
    )
  )
}

function CovidChart({covidData, regions, selectedTypes, useLogScale}) {
  const canvasRef = r.useRef(null);
  const chartRef = r.useRef(null);
  const [screenWidth, screenHeight] = useWindowSize();

  let aspectRatio = 1;
  if (screenWidth > 450 && screenWidth <= 700) {
    aspectRatio = 2;
  } else if (screenWidth > 700 && screenWidth <= 1000) {
    aspectRatio = 3;
  } else if (screenWidth > 1000) {
    aspectRatio = 4;
  }

  r.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const labels = covidData.labels
      .slice(covidSchema.dateStartColumn)
      .map(formatDateLabel);
    const linearYAxisID = 'linearYAxis';
    const logYAxisID = 'logYAxis';
    const yAxesID = useLogScale ? logYAxisID : linearYAxisID;
    const datasets = [];
    regions.forEach((regionKey, regionIndex) => {
      selectedTypes.forEach(dataTypeKey => {
        let ticks = [];
        if (regionKey === covidCountries.all.key) {
          ticks = getGlobalTicks(covidData, dataTypeKey);
        } else {
          const regionIndex = getRegionIndexByKey(covidData, dataTypeKey, regionKey);
          if (regionIndex >= 0) {
            ticks = covidData.ticks[dataTypeKey][regionIndex];
          }
        }
        const paletteDepth = covidDataTypes[dataTypeKey].borderColor.length;
        const dataset = {
          label: `${covidDataTypes[dataTypeKey].title} (${regionKey})`,
          data: ticks.slice(covidSchema.dateStartColumn),
          borderWidth: 1,
          borderColor: covidDataTypes[dataTypeKey].borderColor[regionIndex % paletteDepth],
          fill: false,
          yAxisID: yAxesID,
        };
        datasets.push(dataset);
      });
    });
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const ctx = canvasRef.current.getContext('2d');
    
    
    //this we should have pulled from backend but we don't have time
    var worldata = {
      Afghanistan: [ [ 'Mar 25, 2020', '1' ], [ 'Apr 12, 2020', '2' ] ],
      Albania: [ [ 'Mar 13, 2020', '2' ], [ 'Jun 1, 2020', '0' ] ],
      Algeria: [],
      Andorra: [],
      Angola: [],
      Argentina: [
        [ 'Mar 20, 2020', '2' ],
        [ 'Apr 27, 2020', '1' ],
        [ 'May 11, 2020', '2' ]
      ],
      Aruba: [ [ 'Mar 29, 2020', '2' ] ],
      Australia: [ [ 'Mar 19, 2020', '2' ] ],
      Austria: [ [ 'Mar 13, 2020', '2' ], [ 'Apr 23, 2020', '1' ] ],
      Azerbaijan: [ [ 'Mar 19, 2020', '2' ] ],
      Bahrain: [ [ 'Mar 18, 2020', '1' ] ],
      Bangladesh: [ [ 'Mar 19, 2020', '2' ] ],
      Barbados: [ [ 'Mar 17, 2020', '1' ], [ 'Mar 28, 2020', '2' ] ],
      Belarus: [],
      Belgium: [],
      Belize: [ [ 'Apr 27, 2020', '2' ] ],
      Benin: [ [ 'Mar 30, 2020', '2' ], [ 'May 11, 2020', '0' ] ],
      Bermuda: [ [ 'May 2, 2020', '1' ] ],
      Bhutan: [ [ 'Mar 27, 2020', '2' ] ],
      Bolivia: [ [ 'Mar 21, 2020', '2' ] ],
      'Bosnia and Herzegovina': [ [ 'Mar 16, 2020', '1' ], [ 'Mar 20, 2020', '2' ] ],
      Botswana: [ [ 'Mar 16, 2020', '1' ], [ 'Apr 2, 2020', '2' ] ],
      Brazil: [ [ 'Mar 17, 2020', '2' ] ],
      Brunei: [ [ 'Apr 11, 2020', '1' ] ],
      Bulgaria: [ [ 'Mar 18, 2020', '2' ], [ 'May 6, 2020', '0' ] ],
      'Burkina Faso': [ [ 'May 5, 2020', '0' ] ],
      Cambodia: [ [ 'Apr 17, 2020', '0' ] ],
      Cameroon: [],
      Canada: [ [ 'Mar 20, 2020', '2' ] ],
      'Cape Verde': [ [ 'Mar 20, 2020', '2' ] ],
      'Central African Republic': [ [ 'Mar 26, 2020', '2' ] ],
      Chad: [ [ 'Apr 13, 2020', '2' ] ],
      Chile: [ [ 'Mar 25, 2020', '2' ] ],
      China: [
        [ 'Jan 23, 2020', '2' ],
        [ 'Apr 8, 2020', '1' ],
        [ 'May 10, 2020', '2' ]
      ],
      Colombia: [ [ 'Mar 25, 2020', '2' ] ],
      Congo: [ [ 'Mar 28, 2020', '2' ] ],
      'Costa Rica': [ [ 'Mar 17, 2020', '2' ] ],
      "Cote d'Ivoire": [ [ 'Mar 24, 2020', '2' ] ],
      Croatia: [ [ 'Mar 23, 2020', '2' ], [ 'May 25, 2020', '0' ] ],
      Cuba: [],
      Cyprus: [ [ 'Mar 24, 2020', '2' ] ],
      'Czech Republic': [ [ 'Mar 16, 2020', '2' ], [ 'Apr 2, 2020', '0' ] ],
      'Democratic Republic of Congo': [],
      Denmark: [ [ 'Mar 13, 2020', '1' ] ],
      Djibouti: [ [ 'Mar 23, 2020', '2' ], [ 'May 17, 2020', '0' ] ],
      Dominica: [],
      'Dominican Republic': [ [ 'Mar 20, 2020', '2' ] ],
      Ecuador: [ [ 'Mar 17, 2020', '2' ] ],
      Egypt: [ [ 'Mar 25, 2020', '2' ] ],
      'El Salvador': [ [ 'Mar 18, 2020', '2' ] ],
      Estonia: [ [ 'Mar 14, 2020', '2' ], [ 'May 8, 2020', '0' ] ],
      Ethiopia: [],
      Finland: [
        [ 'Mar 16, 2020', '1' ],
        [ 'Mar 28, 2020', '2' ],
        [ 'Apr 15, 2020', '1' ]
      ],
      France: [ [ 'Mar 14, 2020', '1' ], [ 'Mar 17, 2020', '2' ] ],
      Gabon: [ [ 'Apr 10, 2020', '2' ] ],
      Gambia: [ [ 'Mar 18, 2020', '1' ] ],
      Georgia: [ [ 'Mar 22, 2020', '2' ], [ 'May 29, 2020', '1' ] ],
      Germany: [
        [ 'Mar 18, 2020', '1' ],
        [ 'Mar 19, 2020', '2' ],
        [ 'May 19, 2020', '0' ]
      ],
      Ghana: [ [ 'Apr 19, 2020', '0' ] ],
      Greece: [],
      Greenland: [
        [ 'Mar 13, 2020', '1' ],
        [ 'Mar 18, 2020', '2' ],
        [ 'Apr 22, 2020', '1' ]
      ],
      Guam: [],
      Guatemala: [],
      Guinea: [ [ 'Mar 21, 2020', '1' ], [ 'Mar 27, 2020', '2' ] ],
      Guyana: [ [ 'Mar 11, 2020', '1' ], [ 'Apr 3, 2020', '2' ] ],
      Haiti: [ [ 'Mar 19, 2020', '2' ] ],
      Honduras: [ [ 'Mar 16, 2020', '2' ] ],
      'Hong Kong': [],
      Hungary: [ [ 'Mar 28, 2020', '2' ], [ 'May 4, 2020', '1' ] ],
      Iceland: [],
      India: [ [ 'Mar 20, 2020', '2' ] ],
      Indonesia: [
        [ 'Mar 29, 2020', '1' ],
        [ 'Apr 24, 2020', '2' ],
        [ 'May 3, 2020', '1' ]
      ],
      Iran: [ [ 'Mar 5, 2020', '2' ] ],
      Iraq: [ [ 'Mar 11, 2020', '2' ] ],
      Ireland: [
        [ 'Mar 26, 2020', '1' ],
        [ 'Mar 28, 2020', '2' ],
        [ 'May 18, 2020', '1' ]
      ],
      Israel: [ [ 'Mar 17, 2020', '1' ], [ 'Apr 3, 2020', '2' ] ],
      Italy: [
        [ 'Feb 21, 2020', '2' ],
        [ 'May 4, 2020', '1' ],
        [ 'May 18, 2020', '2' ]
      ],
      Jamaica: [ [ 'Mar 13, 2020', '2' ] ],
      Japan: [ [ 'Feb 25, 2020', '1' ], [ 'May 25, 2020', '0' ] ],
      Jordan: [ [ 'May 6, 2020', '1' ], [ 'May 12, 2020', '2' ] ],
      Kazakhstan: [ [ 'Mar 18, 2020', '2' ], [ 'Jun 1, 2020', '1' ] ],
      Kenya: [ [ 'Mar 27, 2020', '2' ] ],
      Kosovo: [ [ 'Mar 13, 2020', '2' ] ],
      Kuwait: [
        [ 'Apr 6, 2020', '2' ],
        [ 'Apr 21, 2020', '1' ],
        [ 'May 10, 2020', '2' ]
      ],
      Kyrgyzstan: [ [ 'Mar 22, 2020', '1' ], [ 'Mar 25, 2020', '2' ] ],
      Laos: [
        [ 'Mar 30, 2020', '2' ],
        [ 'May 4, 2020', '1' ],
        [ 'May 12, 2020', '2' ],
        [ 'May 18, 2020', '0' ],
        [ 'May 22, 2020', '2' ]
      ],
      Lebanon: [ [ 'Mar 16, 2020', '1' ] ],
      Lesotho: [ [ 'Mar 18, 2020', '2' ], [ 'May 6, 2020', '1' ] ],
      Liberia: [ [ 'Mar 21, 2020', '2' ] ],
      Libya: [ [ 'Mar 16, 2020', '1' ], [ 'Mar 22, 2020', '2' ] ],
      Lithuania: [
        [ 'Mar 16, 2020', '1' ],
        [ 'Apr 10, 2020', '2' ],
        [ 'Apr 14, 2020', '1' ]
      ],
      Luxembourg: [ [ 'Mar 15, 2020', '2' ], [ 'Apr 20, 2020', '1' ] ],
      Macao: [],
      Madagascar: [],
      Malawi: [],
      Malaysia: [],
      Mali: [
        [ 'Mar 25, 2020', '2' ],
        [ 'May 1, 2020', '1' ],
        [ 'May 10, 2020', '0' ]
      ],
      Mauritania: [],
      Mauritius: [ [ 'Mar 23, 2020', '1' ] ],
      Mexico: [ [ 'Mar 24, 2020', '1' ], [ 'Mar 30, 2020', '2' ] ],
      Moldova: [ [ 'Mar 24, 2020', '2' ] ],
      Mongolia: [
        [ 'Feb 21, 2020', '2' ],
        [ 'Mar 17, 2020', '0' ],
        [ 'May 5, 2020', '2' ],
        [ 'May 8, 2020', '0' ]
      ],
      Morocco: [],
      Mozambique: [],
      Myanmar: [],
      Namibia: [ [ 'Mar 27, 2020', '2' ], [ 'May 5, 2020', '0' ] ],
      Nepal: [],
      Netherlands: [ [ 'Mar 15, 2020', '1' ] ],
      'New Zealand': [
        [ 'Mar 21, 2020', '1' ],
        [ 'Mar 23, 2020', '2' ],
        [ 'May 14, 2020', '0' ]
      ],
      Niger: [ [ 'May 13, 2020', '0' ] ],
      Nigeria: [],
      Norway: [ [ 'Mar 16, 2020', '2' ], [ 'Apr 20, 2020', '1' ] ],
      Oman: [ [ 'Mar 18, 2020', '2' ] ],
      Pakistan: [
        [ 'Mar 24, 2020', '2' ],
        [ 'May 16, 2020', '0' ],
        [ 'May 17, 2020', '2' ]
      ],
      Palestine: [ [ 'Mar 5, 2020', '2' ] ],
      Panama: [ [ 'Mar 23, 2020', '2' ] ],
      'Papua New Guinea': [ [ 'Mar 24, 2020', '2' ], [ 'May 13, 2020', '0' ] ],
      Paraguay: [ [ 'May 25, 2020', '1' ] ],
      Peru: [ [ 'Mar 14, 2020', '1' ], [ 'Mar 15, 2020', '2' ] ],
      Philippines: [ [ 'Mar 15, 2020', '2' ], [ 'May 29, 2020', '1' ] ],
      Poland: [ [ 'Mar 12, 2020', '1' ], [ 'Mar 31, 2020', '2' ] ],
      Portugal: [
        [ 'Mar 19, 2020', '1' ],
        [ 'Apr 9, 2020', '2' ],
        [ 'Apr 14, 2020', '1' ],
        [ 'May 1, 2020', '2' ],
        [ 'May 4, 2020', '1' ]
      ],
      'Puerto Rico': [ [ 'Mar 12, 2020', '2' ] ],
      Qatar: [ [ 'Mar 17, 2020', '2' ], [ 'Apr 22, 2020', '1' ] ],
      Romania: [
        [ 'Mar 21, 2020', '1' ],
        [ 'Mar 30, 2020', '2' ],
        [ 'May 15, 2020', '1' ]
      ],
      Russia: [ [ 'Mar 5, 2020', '2' ] ],
      Rwanda: [ [ 'Mar 8, 2020', '2' ], [ 'May 4, 2020', '1' ] ],
      'San Marino': [
        [ 'Mar 8, 2020', '1' ],
        [ 'Apr 17, 2020', '2' ],
        [ 'May 3, 2020', '1' ]
      ],
      'Saudi Arabia': [ [ 'Mar 8, 2020', '2' ] ],
      Senegal: [ [ 'Mar 23, 2020', '2' ] ],
      Serbia: [ [ 'Mar 18, 2020', '2' ], [ 'May 17, 2020', '0' ] ],
      Seychelles: [ [ 'May 4, 2020', '1' ] ],
      'Sierra Leone': [ [ 'Apr 5, 2020', '2' ] ],
      Singapore: [ [ 'Apr 3, 2020', '1' ], [ 'Apr 8, 2020', '2' ] ],
      Slovakia: [
        [ 'Mar 16, 2020', '1' ],
        [ 'Apr 8, 2020', '2' ],
        [ 'Apr 14, 2020', '1' ]
      ],
      Slovenia: [ [ 'Mar 30, 2020', '2' ], [ 'Apr 30, 2020', '0' ] ],
      'Solomon Islands': [
        [ 'Apr 10, 2020', '2' ],
        [ 'Apr 12, 2020', '1' ],
        [ 'May 20, 2020', '2' ],
        [ 'May 23, 2020', '1' ]
      ],
      Somalia: [],
      'South Africa': [ [ 'Mar 26, 2020', '2' ] ],
      'South Korea': [
        [ 'Feb 23, 2020', '1' ],
        [ 'Mar 21, 2020', '2' ],
        [ 'Apr 18, 2020', '1' ],
        [ 'Apr 20, 2020', '0' ],
        [ 'May 29, 2020', '1' ]
      ],
      'South Sudan': [ [ 'Apr 12, 2020', '2' ] ],
      Spain: [ [ 'Mar 9, 2020', '1' ], [ 'May 22, 2020', '2' ] ],
      'Sri Lanka': [ [ 'Mar 18, 2020', '2' ] ],
      Sudan: [ [ 'Mar 23, 2020', '1' ], [ 'Apr 13, 2020', '2' ] ],
      Suriname: [ [ 'Mar 16, 2020', '2' ] ],
      Swaziland: [ [ 'Mar 17, 2020', '1' ], [ 'Mar 27, 2020', '2' ] ],
      Sweden: [ [ 'Apr 4, 2020', '1' ] ],
      Switzerland: [ [ 'Mar 17, 2020', '1' ] ],
      Syria: [
        [ 'Mar 20, 2020', '1' ],
        [ 'Mar 25, 2020', '2' ],
        [ 'May 26, 2020', '0' ]
      ],
      Thailand: [ [ 'Mar 26, 2020', '2' ], [ 'May 18, 2020', '1' ] ],
      Timor: [],
      'Trinidad and Tobago': [],
      Tunisia: [ [ 'Mar 18, 2020', '2' ] ],
      Turkey: [ [ 'Mar 18, 2020', '1' ], [ 'Mar 28, 2020', '2' ] ],
      Turkmenistan: [ [ 'Mar 19, 2020', '2' ] ],
      Uganda: [ [ 'Mar 18, 2020', '1' ], [ 'Mar 30, 2020', '2' ] ],
      Ukraine: [ [ 'Mar 12, 2020', '2' ] ],
      'United Arab Emirates': [ [ 'Mar 23, 2020', '2' ], [ 'Apr 29, 2020', '1' ] ],
      'United Kingdom': [
        [ 'Mar 22, 2020', '1' ],
        [ 'Mar 23, 2020', '2' ],
        [ 'May 13, 2020', '1' ]
      ],
      'United States': [ [ 'Mar 14, 2020', '1' ], [ 'Mar 19, 2020', '2' ] ],
      Uruguay: [
        [ 'Mar 13, 2020', '1' ],
        [ 'Apr 1, 2020', '2' ],
        [ 'Apr 13, 2020', '1' ]
      ],
      Uzbekistan: [ [ 'Mar 24, 2020', '2' ] ],
      Venezuela: [ [ 'Mar 13, 2020', '2' ] ],
      Vietnam: [ [ 'Feb 13, 2020', '2' ] ],
      Yemen: [ [ 'Apr 30, 2020', '2' ] ],
      Zambia: [
        [ 'Mar 29, 2020', '1' ],
        [ 'Apr 14, 2020', '2' ],
        [ 'May 8, 2020', '0' ]
      ],
      Zimbabwe: [ [ 'Mar 30, 2020', '2' ] ]
    }
    annotationsdef = []
    sortbydate1 = []
    sortbydate2 = []
    for (var key in worldata) {
      if (!worldata.hasOwnProperty(key)) {           
          continue;
      }
      policies = worldata[key]
      for(policy of policies){
        //console.log(policy)
        date = policy[0]
        //console.log(date.slice(0,date.length-6))
        //date, [country,policy]
        dateindex = sortbydate1.indexOf(date.slice(0,date.length-6))
        if(dateindex==-1){
          sortbydate1.push(date.slice(0,date.length-6))
          sortbydate2.push([[key,policy[1]]])
        }else{
          sortbydate2[dateindex].push([key,policy[1]])
        }
        


      }
    }
    for(i=0;i<sortbydate1.length;i++){
      annotationsdef.push({
        type: "line",
        mode: "vertical",
        scaleID: "x-axis-0",
        value: sortbydate1[i],
        borderColor: "red",
        label: {
          fontSize: 10,
          content: [sortbydate2[i]],
          enabled: true,
          position: "top",
        },
        onMouseover: function() {
          //var element = this;
          console.log("on")
          //element.options.label.enabled = true;
          //element.chartInstance.update();
          //element.chartInstance.chart.canvas.style.cursor = 'pointer';
        },
        onMouseout: function() {
          var element = this;
          console.log("off")
          element.options.label.enabled = false;
          //element.options.label.content= "";
          console.log(element)
          chartRef.current.update()
          //element.chartInstance.chart.canvas.style.cursor = 'initial';
        }
      })

    }
       
    console.log(annotationsdef)


    config = {
      type: 'line',
      data: {labels, datasets},
      options: {
        annotation: {
          events: ['click', 'dblclick', 'mouseover', 'mouseout'],
          annotations: annotationsdef,
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio,
        scales: {
          yAxes: [
            {
              id: linearYAxisID,
              type: 'linear',
              display: 'auto',
              ticks: {
                callback: (value, index, values) => {
                  return value.toLocaleString();
                }
              }
            },
            {
              id: logYAxisID,
              type: 'logarithmic',
              display: 'auto',
              ticks: {
                // callback: (value, index, values) => {
                //   const numbers = {
                //     '1000000000': '100B',
                //     '100000000': '100M',
                //     '10000000': '10M',
                //     '1000000': '1M',
                //     '100000': '100K',
                //     '10000': '10K',
                //     '1000': '1K',
                //     '100': '100',
                //     '10': '10',
                //     '0': '0',
                //   };
                //   if (numbers.hasOwnProperty(`${value}`)) {
                //     return numbers[`${value}`];
                //   }
                //   return null;
                // }
              }
            },
          ],
        },
      },
    }
    chartRef.current = new Chart(ctx, config);
  }, [useLogScale, selectedTypes, regions, aspectRatio]);
  return e('canvas', {ref: canvasRef}, 'Your browser does not support the canvas element.');
}

function TableFilters({
  onFiltersReset,
  groupByCountry,
  onGroupByCountries,
  countrySearchQuery,
  onCountrySearch,
  useLogScale,
  onUseLogScale,
}) {
  const onReset = (e) => {
    e.preventDefault();
    onFiltersReset();
  };

  return (
    e('form', {className: 'form-inline'},
      e('div', {className: 'form-group mr-3 mb-2'},
        e(CountrySearch, {countrySearchQuery, onCountrySearch})
      ),
      e('div', {className: 'form-group form-check mr-3 mb-2'},
        e(Toggle, {checked: groupByCountry, onChange: onGroupByCountries, text: 'Group by countries'})
      ),
      e('div', {className: 'form-group form-check mr-3 mb-2'},
        e(Toggle, {text: 'Logarithmic scale', onChange: onUseLogScale, checked: useLogScale})
      ),
      e('button', {className: 'btn btn-dark mb-2', onClick: onReset},
        e('i', {className: 'fas fa-trash-alt mr-2'}),
        'Reset Filters'
      )
    )
  );
}

function CountrySearch({countrySearchQuery, onCountrySearch}) {
  return (
    e('input', {
      type: 'search',
      className: 'form-control',
      placeholder: 'Search country',
      onChange: (e) => onCountrySearch(e.target.value),
      value: countrySearchQuery,
    })
  );
}

function RegionsTable({
  groupByCountry,
  covidData,
  selectedRegions,
  onRegionChange,
  countrySearchQuery,
  dataSort,
  dataSortDirection,
  onDataSort,
}) {
  const onColumnSort = (columnName) => {
    if (columnName === dataSort) {
      const newDataSortDirection =
        dataSortDirection === covidSortDirections.asc.key ? covidSortDirections.desc.key : covidSortDirections.asc.key;
      onDataSort(columnName, newDataSortDirection);
    } else {
      onDataSort(columnName, dataSortDirection);
    }
  };
  const tHead = (
    e('thead', {className: 'thead-dark'},
      e('tr', null,
        e('th', null, ''),
        e('th', null, ''),
        e('th', {sortable: 'sortable', onClick: () => onColumnSort(covidSorts.country.key)},
          groupByCountry ? 'Countries' : 'Regions',
          e(ColumnSorter, {sortDirection: dataSort === covidSorts.country.key ? dataSortDirection : null})
        ),
        e('th', {sortable: 'sortable', onClick: () => onColumnSort(covidSorts.confirmed.key)},
          covidDataTypes.confirmed.title,
          e(ColumnSorter, {sortDirection: dataSort === covidSorts.confirmed.key ? dataSortDirection : null})
        ),
        e('th', {sortable: 'sortable', onClick: () => onColumnSort(covidSorts.recovered.key)},
          covidDataTypes.recovered.title,
          e(ColumnSorter, {sortDirection: dataSort === covidSorts.recovered.key ? dataSortDirection : null})
        ),
        e('th', {sortable: 'sortable', onClick: () => onColumnSort(covidSorts.deaths.key)},
          covidDataTypes.deaths.title,
          e(ColumnSorter, {sortDirection: dataSort === covidSorts.deaths.key ? dataSortDirection : null})
        ),
        e('th', {sortable: 'sortable', onClick: () => onColumnSort(covidSorts.mortality.key)},
          'Mortality',
          e(ColumnSorter, {sortDirection: dataSort === covidSorts.mortality.key ? dataSortDirection : null})
        ),
      ),
    )
  );
  const rows = getCovidRegions(covidData)
    .filter((region) => {
      if (!countrySearchQuery) {
        return true;
      }
      const escapedCountrySearchQuery = escapeRegExp(countrySearchQuery.trim());
      return region.key.search(
        new RegExp(escapedCountrySearchQuery, 'i')
      ) >= 0;
    })
    .sort((regionA, regionB) => {
      let sortCriteriaA;
      let sortCriteriaB;
      switch (dataSort) {
        case covidSorts.country.key:
          sortCriteriaA = regionA.key;
          sortCriteriaB = regionB.key;
          break;
        case covidSorts.mortality.key:
          sortCriteriaA = calculateMortality(
            regionA.numbers[covidDataTypes.confirmed.key],
            regionA.numbers[covidDataTypes.deaths.key]
          );
          sortCriteriaB = calculateMortality(
            regionB.numbers[covidDataTypes.confirmed.key],
            regionB.numbers[covidDataTypes.deaths.key]
          );
          break;
        default:
          sortCriteriaA = regionA.numbers[covidSorts[dataSort].dataKey];
          sortCriteriaB = regionB.numbers[covidSorts[dataSort].dataKey];
      }
      if (sortCriteriaA === sortCriteriaB) {
        return 0;
      }
      if (sortCriteriaA > sortCriteriaB) {
        return dataSortDirection === covidSortDirections.desc.key ? -1 : 1;
      }
      return dataSortDirection === covidSortDirections.desc.key ? 1 : -1;
    })
    .map((region, regionIndex) => {
      const checked = !!selectedRegions.includes(region.key);
      const confirmedNumber = region.numbers[covidDataTypes.confirmed.key] >= 0 ? region.numbers[covidDataTypes.confirmed.key] : '';
      const recoveredNumber = region.numbers[covidDataTypes.recovered.key] >= 0 ? region.numbers[covidDataTypes.recovered.key] : '';
      const deathsNumber = region.numbers[covidDataTypes.deaths.key] >= 0 ? region.numbers[covidDataTypes.deaths.key] : '';

      const mortality = calculateMortality(
        region.numbers[covidDataTypes.confirmed.key],
        region.numbers[covidDataTypes.deaths.key]
      );
      let mortalityNumber = `${mortality}%`;

      return (
        e('tr', {key: region.key, onClick: () => onRegionChange(region.key)},
          e('td', null, e('input', {type: 'checkbox', checked, onChange: () => {}})),
          e('td', null, e('small', {className: 'text-dark'}, `#${regionIndex + 1}`)),
          e('td', null, region.key),
          e('td', null, confirmedNumber),
          e('td', null, recoveredNumber),
          e('td', null, deathsNumber),
          e('td', null, e('small', {className: 'text-dark'}, mortalityNumber)),
        )
      );
    });
  const tBody = e('tbody', null, rows);
  return (
    e('div', null,
      e('div', {className: 'table-responsive covid-data-table-wrapper'},
        e('table', {className: 'table table-hover'}, tHead, tBody)
      ),
      e('small', {className: 'text-dark'}, '* Table is scrollable')
    )
  );
}

function ColumnSorter({sortDirection}) {
  const className = sortDirection ? 'ml-2' : 'ml-2 text-dark';
  let sorter = null;
  if (!sortDirection) {
    sorter = e('i', {className: 'fas fa-sort'});
  } else if (sortDirection === covidSortDirections.asc.key) {
    sorter = e('i', {className: 'fas fa-sort-up'});
  } else {
    sorter = e('i', {className: 'fas fa-sort-down'});
  }
  return (
    e('span', {className}, sorter)
  );
}

function ErrorMessage({errorMessage}) {
  return e('div', {className: 'alert alert-danger'}, errorMessage);
}

function Spinner() {
  return e(
    'div', {className: 'd-flex justify-content-center mt-5 mb-5'},
    e('div', {className: 'spinner-border'})
  );
}

function Toggle({text, checked, onChange}) {
  return (
    e('label', {},
      e('div', {className: 'form-group form-check mb-0'},
        e('input', {
          type: 'checkbox',
          checked: checked,
          className: 'form-check-input',
          onChange: (event) => onChange(event.target.checked)
        }),
        e('div', {className: 'form-check-label'}, text)
      )
    )
  )
}
