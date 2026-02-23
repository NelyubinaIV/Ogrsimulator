import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import { QUESTIONS } from '../data/questions';

interface StudentDetailReportProps {
  studentId: string;
  studentName: string;
  open: boolean;
  onClose: () => void;
}

interface TaskStat {
  taskNumber: number;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  incorrectQuestions: {
    questionId: string;
    questionText: string;
    attempts: number;
  }[];
}

export function StudentDetailReport({ studentId, studentName, open, onClose }: StudentDetailReportProps) {
  const [taskStats, setTaskStats] = useState<TaskStat[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  useEffect(() => {
    if (open && studentId) {
      loadStudentData();
    }
  }, [open, studentId]);

  const loadStudentData = () => {
    const progressData = localStorage.getItem(`progress_${studentId}`);
    
    if (progressData) {
      const data = JSON.parse(progressData);
      
      // Анализ заданий 2-12
      const stats: { [key: number]: TaskStat } = {};
      
      Object.entries(data.completedQuestions || {}).forEach(([questionId, qData]: [string, any]) => {
        const taskNumber = parseInt(questionId.split('_')[1]);
        
        if (!stats[taskNumber]) {
          stats[taskNumber] = {
            taskNumber,
            total: 0,
            correct: 0,
            incorrect: 0,
            percentage: 0,
            incorrectQuestions: [],
          };
        }
        
        stats[taskNumber].total++;
        
        if (qData.correct) {
          stats[taskNumber].correct++;
        } else {
          stats[taskNumber].incorrect++;
          
          // Найти текст вопроса
          const question = QUESTIONS.find(q => q.id === questionId);
          stats[taskNumber].incorrectQuestions.push({
            questionId,
            questionText: question?.text || 'Вопрос не найден',
            attempts: qData.attempts || 1,
          });
        }
      });

      // Рассчитать процент для каждого задания
      const statsArray = Object.values(stats).map(stat => ({
        ...stat,
        percentage: stat.total > 0 ? (stat.correct / stat.total) * 100 : 0,
      }));

      // Сортировка по номеру задания
      statsArray.sort((a, b) => a.taskNumber - b.taskNumber);
      
      setTaskStats(statsArray);

      // Загруженные файлы
      const files: any[] = [];
      Object.entries(data.uploadedFiles || {}).forEach(([taskNum, taskFiles]: [string, any]) => {
        if (Array.isArray(taskFiles)) {
          taskFiles.forEach((file: any) => {
            files.push({
              taskNumber: taskNum,
              ...file,
            });
          });
        }
      });
      setUploadedFiles(files);
    }
  };

  const exportToExcel = () => {
    // Подготовка данных для экспорта
    const summaryData = taskStats.map(stat => ({
      'Номер задания': stat.taskNumber,
      'Всего выполнено': stat.total,
      'Правильно': stat.correct,
      'Неправильно': stat.incorrect,
      'Процент правильных': `${stat.percentage.toFixed(1)}%`,
    }));

    // Детальная информация об ошибках
    const errorsData: any[] = [];
    taskStats.forEach(stat => {
      stat.incorrectQuestions.forEach(q => {
        errorsData.push({
          'Номер задания': stat.taskNumber,
          'Вопрос': q.questionText.substring(0, 100) + '...',
          'Количество попыток': q.attempts,
        });
      });
    });

    // Информация о загруженных файлах
    const filesData = uploadedFiles.map(file => ({
      'Номер задания': file.taskNumber,
      'Имя файла': file.filename,
      'Дата загрузки': new Date(file.uploadDate).toLocaleString('ru-RU'),
    }));

    // Создание workbook
    const wb = XLSX.utils.book_new();

    // Лист с общей статистикой
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Общая статистика');

    // Лист с ошибками
    if (errorsData.length > 0) {
      const wsErrors = XLSX.utils.json_to_sheet(errorsData);
      XLSX.utils.book_append_sheet(wb, wsErrors, 'Ошибки');
    }

    // Лист с загруженными файлами
    if (filesData.length > 0) {
      const wsFiles = XLSX.utils.json_to_sheet(filesData);
      XLSX.utils.book_append_sheet(wb, wsFiles, 'Загруженные файлы');
    }

    // Экспорт файла
    const fileName = `Отчет_${studentName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const totalQuestions = taskStats.reduce((sum, stat) => sum + stat.total, 0);
  const totalCorrect = taskStats.reduce((sum, stat) => sum + stat.correct, 0);
  const totalIncorrect = taskStats.reduce((sum, stat) => sum + stat.incorrect, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Детальный отчет: {studentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Общая статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Всего заданий</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalQuestions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-2 border-green-200 dark:border-green-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Правильных</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalCorrect}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-2 border-red-200 dark:border-red-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300">Неправильных</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{totalIncorrect}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Точность</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{overallAccuracy.toFixed(0)}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Кнопка экспорта */}
          <div className="flex justify-end">
            <Button
              onClick={exportToExcel}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспортировать в Excel
            </Button>
          </div>

          {/* Статистика по заданиям */}
          <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Статистика по заданиям
            </h3>
            <div className="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-bold">Номер задания</TableHead>
                    <TableHead className="font-bold">Выполнено</TableHead>
                    <TableHead className="font-bold">Правильно</TableHead>
                    <TableHead className="font-bold">Неправильно</TableHead>
                    <TableHead className="font-bold">Процент</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskStats.map((stat, index) => (
                    <motion.tr
                      key={stat.taskNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="font-medium">Задание {stat.taskNumber}</TableCell>
                      <TableCell>{stat.total}</TableCell>
                      <TableCell>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {stat.correct}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {stat.incorrect}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                stat.percentage >= 80
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : stat.percentage >= 60
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-red-500 to-rose-500'
                              }`}
                              style={{ width: `${stat.percentage}%` }}
                            />
                          </div>
                          <span className="font-medium min-w-[50px]">{stat.percentage.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Детали ошибок */}
          {taskStats.some(stat => stat.incorrectQuestions.length > 0) && (
            <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Детали ошибок
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {taskStats.map((stat) =>
                  stat.incorrectQuestions.map((q, idx) => (
                    <motion.div
                      key={`${stat.taskNumber}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-lg">
                              Задание {stat.taskNumber}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Попыток: {q.attempts}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {q.questionText}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* Загруженные файлы */}
          {uploadedFiles.length > 0 && (
            <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Загруженные файлы (Задания 1 и 13)
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Задание {file.taskNumber}: {file.filename}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(file.uploadDate).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
