import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { BarChart3 } from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
    
    // Mock Data based on prompt guidelines
    const barData = {
        labels: ['Senior Backend', 'Frontend Dev', 'ML Engineer', 'Product Manager'],
        datasets: [{
            label: 'Applicants per Job',
            data: [42, 65, 23, 15],
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1,
            borderRadius: 6
        }]
    };

    const pieData = {
        labels: ['React', 'Java', 'Python', 'AWS', 'Spring Boot'],
        datasets: [{
            data: [35, 25, 20, 10, 10],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(16, 185, 129, 0.8)',
            ],
            borderColor: 'transparent'
        }]
    };

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Application Growth',
            data: [10, 25, 45, 80, 120, 180],
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } } },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } },
            x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } }
        }
    };
    
    const pieOptions = {
        responsive: true,
        plugins: { legend: { position: 'right', labels: { color: 'rgba(255, 255, 255, 0.7)' } } },
    };

    return (
        <div className="space-y-6">
            <header className="pb-4 border-b border-white/10">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                    Platform Analytics
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Applicants per Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar data={barData} options={chartOptions} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Skills in Pool</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-64">
                        <Pie data={pieData} options={pieOptions} />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Application Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="h-72 w-full">
                            <Line data={lineData} options={{...chartOptions, maintainAspectRatio: false}} />
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
