import React, { useEffect, useState } from "react";
import NavBar from "../Navbar/NavBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  registerables,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_AVERAGE_TIME,
  GET_DEPARTMENTS,
  GET_EMPLOYEES,
} from "../../Graphql/Query";
import { departmentProps } from "../EmployeeDetails/EmployeeDetails";
import { EmpList } from "../EmployeeDetails/model/EmpList";
import { useLocation } from "react-router-dom";
import { title } from "process";
import { Display } from "react-bootstrap-icons";

type chartType = {
  backgroundColor: string;
  data: number[];
  barCount: number;
  label: string;
};

type dashboardProps = {
  loginTime: Date | undefined;
};
const Dashboard = (props: dashboardProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );
  const lov = useQuery(GET_DEPARTMENTS);
  ChartJS.register(...registerables);
  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  const [emp, setEmp] = useState<EmpList[]>([]);
  const [desCount, setDesCount] = useState<chartType[]>([]);
  const { state } = useLocation();
  const { email } = state;
  const [avgTimeData, setAvgTimeData] = useState<Number[]>([]);

  // console.log("dasada", email, props.loginTime);
  const [departments, setDepartments] = useState<departmentProps[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);

  const { loading : loadingAvgTime, error: errorAvgTime, data: dataAvgTime } = useQuery(GET_AVERAGE_TIME, {
    variables: { email: email },
  });

  useEffect(() => {
    if (errorAvgTime) {
      alert("error");
    } else if (loadingAvgTime) {
      // loading code if any
    } else {
      setAvgTimeData(dataAvgTime?.averageTime);
      console.log(avgTimeData)
    }
  },[dataAvgTime]);

  const backgroundColor = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ];

  useEffect(() => {
    if (error) {
      alert("error");
    } else if (loading) {
      // loading code if any
    } else {
      setEmp(data?.employees);
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (lov?.data) {
      setDepartments(lov?.data?.departments);
      let data: any[] = [];
      lov?.data?.departments.map((element: any) => {
        return (data = [...data, ...element.designations]);
      });
      setDesignations(data);
    }
  }, [lov]);

  useEffect(() => {
    let count: any[] = [];

    let departWiseCount: any = {};
    designations.forEach((element) => (departWiseCount[element] = [0, 0]));

    designations.map((des) => {
      let designEmp = emp.filter((data) => data.designation === des);
      let empCount = designEmp?.length;

      // Bar Chart --------------------------------
      designEmp.map((dt) => {
        if (dt.department === "Delivery") {
          departWiseCount[des][0] = departWiseCount[des][0] + 1;
        } else if (dt.department === "Administration") {
          departWiseCount[des][1] = departWiseCount[des][1] + 1;
        }
      });
      // ---------------------------------Bar Chart

      count.push({
        label: des,
        barCount: empCount,
        data: departWiseCount[des],
        backgroundColor: backgroundColor[count.length],
      });
    });

    setDesCount(count);
  }, [designations, lov, emp]);

  const DoughnutData = {
    labels: designations,
    datasets: [
      {
        label: "Employees",
        data: desCount.map((des) => des?.barCount),
        backgroundColor: desCount.map((des) => des?.backgroundColor),
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Bar Chart",
      },
    },
  };

  const labels = departments.map((data) => data.name);

  const barChartData = {
    labels,
    datasets: desCount,
  };

  const lineChartData = {
    labels: avgTimeData.map((x:Number,ind:Number)=>ind),
    datasets: [
      {
        label: "Minutes spent on platform",
        data: avgTimeData

        ,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

  return (
    <React.Fragment>
      <NavBar loginTime={props.loginTime} />
      <div className="main-container px-5 py-4">
        <div className="row">
          <div className="col">
            <Doughnut data={DoughnutData} />
          </div>
          <div className="col">
            <Bar options={barOptions} data={barChartData} />
          </div>
          
        </div>
        <div className="col">
              <Line data={lineChartData} />
          </div>
      </div>
    </React.Fragment>
  );
};
export default Dashboard;
