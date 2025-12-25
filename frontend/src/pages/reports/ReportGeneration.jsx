import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, FileText, Calendar, Users, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportGeneration() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareEmails, setShareEmails] = useState('');
    const [reportFormat, setReportFormat] = useState('PDF');

    useEffect(() => {
        // Check if report already exists
        fetchExistingReport();
    }, [campaignId]);

    const fetchExistingReport = async () => {
        try {
            // Try to get latest report for this campaign
            const res = await fetch(`/backend/reports/campaign/${campaignId}`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                if (data.reports && data.reports.length > 0) {
                    setReport(data.reports[0]);
                }
            }
        } catch (error) {
            // Report doesn't exist yet, that's fine
        }
    };

    const generateReport = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/backend/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    campaignId,
                    reportType: 'Campaign',
                    format: reportFormat,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setReport(data.report);
                toast.success('Report generated successfully!');
            } else {
                toast.error(data.message || 'Failed to generate report');
            }
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    const downloadReport = async (format) => {
        if (!report) return;

        setLoading(true);
        try {
            // For PDF, we'll need to implement PDF generation on the frontend
            // For now, we'll create a downloadable text/HTML version
            if (format === 'PDF') {
                // Generate PDF using browser print or jsPDF
                const printWindow = window.open('', '_blank');
                printWindow.document.write(generateHTMLReport());
                printWindow.document.close();
                printWindow.print();
            } else if (format === 'CSV') {
                // Generate CSV
                const csv = generateCSVReport();
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `campaign-report-${campaignId}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
            toast.success(`Report downloaded as ${format}`);
        } catch (error) {
            toast.error('Failed to download report');
        } finally {
            setLoading(false);
        }
    };

    const shareReport = async () => {
        if (!report) return;

        const emails = shareEmails.split(',').map(e => e.trim()).filter(e => e);
        if (emails.length === 0) {
            toast.error('Please enter at least one email address');
            return;
        }

        try {
            const res = await fetch(`/backend/reports/${report._id}/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ emails }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Report shared successfully!');
                setShowShareModal(false);
                setShareEmails('');
            } else {
                toast.error(data.message || 'Failed to share report');
            }
        } catch (error) {
            toast.error('Failed to share report');
        }
    };

    const generateHTMLReport = () => {
        if (!report || !report.data) return '';

        const data = report.data;
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Campaign Report - ${data.campaign?.name || 'Campaign'}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #7c3aed; }
                    h2 { color: #6b21a8; margin-top: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f3f4f6; }
                    .stat { display: inline-block; margin: 10px; padding: 15px; background: #f9fafb; border-radius: 8px; }
                </style>
            </head>
            <body>
                <h1>Campaign Report: ${data.campaign?.name || 'Campaign'}</h1>
                <p><strong>Brand:</strong> ${data.campaign?.brand || 'N/A'}</p>
                <p><strong>Status:</strong> ${data.campaign?.status || 'N/A'}</p>
                <p><strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}</p>
                
                <h2>Statistics</h2>
                <div class="stat"><strong>Total Deliverables:</strong> ${data.statistics?.totalDeliverables || 0}</div>
                <div class="stat"><strong>Completed:</strong> ${data.statistics?.completed || 0}</div>
                <div class="stat"><strong>On-Time Rate:</strong> ${data.statistics?.onTimeRate?.toFixed(1) || 0}%</div>
                <div class="stat"><strong>Total Amount:</strong> $${data.statistics?.totalAmount?.toFixed(2) || 0}</div>
                
                <h2>Deliverables</h2>
                <table>
                    <tr>
                        <th>Creator</th>
                        <th>Platform</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Post URL</th>
                    </tr>
                    ${(data.deliverables || []).map(d => `
                        <tr>
                            <td>${d.creator}</td>
                            <td>${d.platform}</td>
                            <td>${d.contentType}</td>
                            <td>${d.status}</td>
                            <td>${d.postingDetails?.postUrl || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h2>Timeline</h2>
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Actor</th>
                    </tr>
                    ${(data.timeline || []).map(t => `
                        <tr>
                            <td>${new Date(t.date).toLocaleDateString()}</td>
                            <td>${t.action}</td>
                            <td>${t.actor}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;
    };

    const generateCSVReport = () => {
        if (!report || !report.data) return '';

        const data = report.data;
        let csv = 'Campaign Report\n';
        csv += `Campaign Name,${data.campaign?.name || ''}\n`;
        csv += `Brand,${data.campaign?.brand || ''}\n`;
        csv += `Status,${data.campaign?.status || ''}\n\n`;
        
        csv += 'Deliverables\n';
        csv += 'Creator,Platform,Type,Status,Post URL\n';
        (data.deliverables || []).forEach(d => {
            csv += `${d.creator},${d.platform},${d.contentType},${d.status},${d.postingDetails?.postUrl || ''}\n`;
        });
        
        csv += '\nTimeline\n';
        csv += 'Date,Action,Actor\n';
        (data.timeline || []).forEach(t => {
            csv += `${new Date(t.date).toLocaleDateString()},${t.action},${t.actor}\n`;
        });
        
        return csv;
    };

    if (!report) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link
                        to={`/campaigns/${campaignId}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Campaign
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Campaign Report</h1>
                        <p className="text-gray-600 mb-6">
                            Create a comprehensive report for this campaign including all deliverables, timeline, and statistics.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Report Format
                            </label>
                            <select
                                value={reportFormat}
                                onChange={(e) => setReportFormat(e.target.value)}
                                className="w-full max-w-xs mx-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="PDF">PDF</option>
                                <option value="CSV">CSV</option>
                                <option value="Web">Web Link</option>
                            </select>
                        </div>

                        <button
                            onClick={generateReport}
                            disabled={generating}
                            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                            {generating ? (
                                <>
                                    <Clock className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const data = report.data || {};

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to={`/campaigns/${campaignId}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Campaign
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Campaign Report</h1>
                            <p className="text-gray-600 mt-1">
                                Generated: {new Date(report.generatedAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => downloadReport('PDF')}
                                disabled={loading}
                                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                <Download className="w-5 h-5" />
                                Download PDF
                            </button>
                            <button
                                onClick={() => downloadReport('CSV')}
                                disabled={loading}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Download className="w-5 h-5" />
                                Download CSV
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Campaign Overview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Campaign Name</p>
                            <p className="text-lg font-medium text-gray-900">{data.campaign?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Brand</p>
                            <p className="text-lg font-medium text-gray-900">{data.campaign?.brand || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="text-lg font-medium text-gray-900">{data.campaign?.status || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Platforms</p>
                            <p className="text-lg font-medium text-gray-900">
                                {data.campaign?.platforms?.join(', ') || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Deliverables</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {data.statistics?.totalDeliverables || 0}
                                </p>
                            </div>
                            <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {data.statistics?.completed || 0}
                                </p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">On-Time Rate</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {data.statistics?.onTimeRate?.toFixed(1) || 0}%
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                    ${data.statistics?.totalAmount?.toFixed(2) || 0}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Deliverables */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Deliverables</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Creator</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Platform</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Post URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.deliverables || []).map((d, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-sm text-gray-900">{d.creator}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{d.platform}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{d.contentType}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                d.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                d.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {d.postingDetails?.postUrl ? (
                                                <a href={d.postingDetails.postUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-sm">
                                                    View Post
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
                    <div className="space-y-3">
                        {(data.timeline || []).map((event, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{event.action}</p>
                                    <p className="text-sm text-gray-600">{event.actor}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(event.date).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Report</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Addresses (comma-separated)
                                    </label>
                                    <textarea
                                        value={shareEmails}
                                        onChange={(e) => setShareEmails(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="email1@example.com, email2@example.com"
                                    />
                                </div>
                                {report.shareableLink && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shareable Link
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={`${window.location.origin}/report/${report.shareableLink}`}
                                                readOnly
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/report/${report.shareableLink}`);
                                                    toast.success('Link copied to clipboard!');
                                                }}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={shareReport}
                                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Share Report
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowShareModal(false);
                                            setShareEmails('');
                                        }}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

