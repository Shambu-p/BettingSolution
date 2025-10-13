import React, { useContext, useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartType, ChartData, ChartOptions } from 'chart.js';
import MainAPI from '../../APIs/MainAPI';
import AuthContext from '../../Contexts/AuthContext';
import Utils from '../../Models/Utils';
import AlertContext from '../../Contexts/AlertContext';
import SimpleList from './SimpleList';
import reportCondition from '../../Scripts/reportCondition';

// Register all Chart.js components
Chart.register(...registerables);

const DynamicReport = ({configName, inputParams}: {configName: string, inputParams: any}) => {

	const { loggedUser, isLoggedIn, cookies, localData, forms } = useContext(AuthContext);
	const { setAlert } = useContext(AlertContext);

	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstanceRef = useRef<Chart | null>(null);

	const [computedData, setComputedData] = useState<any>({});
	const [tableData, setTableData] = useState<any>([]);
	const [computedOptions, setComputedOptions] = useState<any>();
	const [localWaiting, setLocalWaiting] = useState<any>(false);

	const chartColors = [
        "#FF5733", // Bright Red-Orange
        "#33FF57", // Neon Green
        "#3357FF", // Vivid Blue
        "#FF33A1", // Hot Pink
        "#FFD700", // Gold
        "#00CED1", // Dark Turquoise
        "#8A2BE2", // Blue Violet
        "#FF4500", // Orange Red
        "#1E90FF", // Dodger Blue
        "#32CD32", // Lime Green
        "#DC143C", // Crimson
        "#20B2AA", // Light Sea Green
        "#FF8C00", // Dark Orange
        "#9932CC", // Dark Orchid
        "#ADFF2F", // Green Yellow
        "#4682B4", // Steel Blue
        "#C71585", // Medium Violet Red
        "#40E0D0", // Turquoise
        "#9370DB", // Medium Purple
        "#3CB371", // Medium Sea Green
    ];

	useEffect(() => {

		if(!localData.ReportConfig[configName]) {
			console.log("report configuration not found!");
			return;
		}

		setTimeout(() => {
			if (chartRef.current) {
				const ctx = chartRef.current.getContext('2d');
	
				if (ctx) {
					// Destroy the previous chart instance if it exists
					if (chartInstanceRef.current) {
						chartInstanceRef.current.destroy();
					}

					// Create a new chart instance
					chartInstanceRef.current = new Chart(ctx, {
						type: ((localData.ReportConfig[configName].chartType == "horizontal-bar") ? "bar" : localData.ReportConfig[configName].chartType),
						data: computedData,
						options: computedOptions
					});
				}
			}
		}, 100);

		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, [computedData, computedOptions]);

	useEffect(() => {
		
		getData();

	}, [configName, inputParams]);

	function groupEachArrayByProperty(matrix: any[], property: any) {
		return matrix.map(subArray => {
			const grouped = subArray.records.reduce((acc: any, obj: any) => {

				let key = `${subArray.id}##${Utils.getVariableData(property.field, obj)}`
				let result = Utils.findGroup({...acc}, key, property.check_method);

				if (!result.isFound) {
					acc[key] = {
						id: Utils.getVariableData(property.label, obj),
						records: []
					};
				}

				acc[result.key].records.push(obj);
				return {...acc};

			}, {});
	
			return Object.values(grouped); // Return grouped objects as separate arrays
		}).flat(); // Flatten one level to maintain sibling group structure
	}
	
	function aggregateNumbers(numbers: number[], method: string) {
		if (!Array.isArray(numbers) || numbers.length === 0) {
			console.log("Invalid input: numbers must be a non-empty array.");
			return 0;
		}
	
		switch (method.toLowerCase()) {
			case 'sum':
				return numbers.reduce((acc, num) => acc + num, 0);
	
			case 'average':
				return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
	
			case 'min':
				return Math.min(...numbers);
	
			case 'max':
				return Math.max(...numbers);
	
			case 'count':
				return numbers.length;
	
			default:
				console.log("Invalid method: Supported methods are 'sum', 'average', 'min', 'max', and 'count'.");
				return 0;
		}
	}
	
	function calculate(matrixData: any[], calcMethods: {field: string, agg: string}[]) {
		return calcMethods.reduce((mxData, calcMethod) => {
			return mxData.map(md => {
				return {
					...md,
					[`${calcMethod.field}.${calcMethod.agg}`]: (calcMethod.agg != "count") ? (aggregateNumbers(
							md.records.map((rcd: any) => (Utils.getVariableData(calcMethod.field, rcd))),
							calcMethod.agg
						)) : (md.records.length)
				};
			});
		}, matrixData);
	}
	
	function multiGrouping(matrix: any, properties: any) {
		return properties.reduce((acc: any[], prop: string) => {
			return groupEachArrayByProperty(acc, prop);
		}, [{id: "main", records: matrix}]);
	}
	

	const getData = async () => {

		setTimeout(() => {setLocalWaiting(true)}, 100);

		try {

			let result = await MainAPI.getReportData(cookies.login_token, localData.ReportConfig[configName].tableName, 1, 0, reportCondition[configName](inputParams));

			let groupped_data = multiGrouping(result.Items, localData.ReportConfig[configName].groupings);
			let final_data = calculate(groupped_data, localData.ReportConfig[configName].calculationMethods);

			
			if(localData.ReportConfig[configName].chartType == "list") {
				setTableData(final_data);
			} else {

				let chData = {
					labels: final_data.map(fd => (fd.id)),
					datasets: localData.ReportConfig[configName].calculationMethods.map((method: any) => ({
						label: method.name,
						data: final_data.map(fd => (fd[`${method.field}.${method.agg}`])),
						backgroundColor: final_data.map(fd => (method.color ?? "blue"))
						// chartColors.slice(0, final_data.length)
					}))
				};

				let chOptions: any = {
					plugins: {
						title: {
							display: true,
							text: localData.ReportConfig[configName].title
						},
						legend: {
							display: false,
							labels: {
								color: localData.ReportConfig[configName].legendColor
							},
							position: "left"
						}
					},
					scales: {
						y: {
							beginAtZero: true,
						},
						x: {
							ticks: {
								display: false // ❌ hide tick labels on x-axis
							},
							title: {
								display: false // ❌ hide axis title on x-axis
							}
						},
						// y: {
						// 	beginAtZero: true,
						// 	ticks: {
						// 		display: false // ❌ hide tick labels on y-axis
						// 	},
						// 	title: {
						// 		display: false // ❌ hide axis title on y-axis
						// 	}
						// }
					},
	
				};

				if(localData.ReportConfig[configName].chartType == "horizontal-bar") {
					chOptions.indexAxis = "y";
					chOptions.scales = {
						y: {
							beginAtZero: true,
						},
						x: {
							ticks: {
								display: false // ❌ hide tick labels on x-axis
							},
							title: {
								display: false // ❌ hide axis title on x-axis
							}
						}
					};
				}

				if(["bar", "pie", "doughnut"].includes(localData.ReportConfig[configName].chartType)) {
					chOptions.scales = {
						x: {
							ticks: {
								display: false // ❌ hide tick labels on x-axis
							},
							title: {
								display: false // ❌ hide axis title on x-axis
							}
						},
						y: {
							beginAtZero: true,
							ticks: {
								display: false // ❌ hide tick labels on y-axis
							},
							title: {
								display: false // ❌ hide axis title on y-axis
							}
						}
					};
				}

				setComputedData(chData);
				setComputedOptions(chOptions);

			}


		} catch(error: any) {
			console.log(error);
			setAlert(error.message, "error")
		}

		setTimeout(() => {setLocalWaiting(false)}, 100);		

	}

	//[(`${localData.ReportConfig[configName].calculationMethods[0].field}.${localData.ReportConfig[configName].calculationMethods[0].agg}`)]
	return (
		<div className={`h-100 ${["bar", "horizontal-bar"].includes(localData.ReportConfig[configName].chartType) ? "w-100" : ""}`} >
			<div className="justify-content-center align-items-center h-100" style={{display: (localWaiting ? "block" : "none")}}>
				<div className="spinner-border" style={{color: 'var(--button_bg)'}} role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
			{
				(localData.ReportConfig[configName].chartType == "score") ? (
					<div className="justify-content-center">
						<div className="">
							<h6 className="text-muted text-center" style={{color: "var(--border_color) !important", fontSize: "25px"}}>{localData.ReportConfig[configName].title}</h6>
							<h2 className="text-center" style={{fontSize: "70px"}}>{computedData.datasets ? computedData.datasets[0].data[0] : 0}</h2>
						</div>
					</div>
				) : ((localData.ReportConfig[configName].chartType == "list") ? (
					<SimpleList
						title={localData.ReportConfig[configName].title}
						tableName={localData.ReportConfig[configName].tableName}
						records={tableData}
						visibleFields={localData.ReportConfig[configName].visibleFields}
					/>
				) : (<canvas ref={chartRef} style={{display: (localWaiting ? "none" : "block")}} />))
			}
		</div>
	);
};

export default DynamicReport;