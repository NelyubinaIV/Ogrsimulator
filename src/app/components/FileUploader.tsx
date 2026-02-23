import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, X, File } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface FileUploaderProps {
  taskNumber: number;
  onUpload: (file: { filename: string; url: string }) => void;
}

export function FileUploader({ taskNumber, onUpload }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    // Симуляция загрузки файла
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Создаем мок URL для файла
    const mockUrl = URL.createObjectURL(selectedFile);

    onUpload({
      filename: selectedFile.name,
      url: mockUrl,
    });

    setSelectedFile(null);
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 rounded-3xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Загрузка файла
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Задание {taskNumber} - требует ручной проверки
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-2xl p-8 text-center">
          {!selectedFile ? (
            <div>
              <Upload className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Выберите файл для загрузки
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                PDF, DOC, DOCX, JPG, PNG (макс. 10 МБ)
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-orange-300 dark:border-orange-700"
              >
                Выбрать файл
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-200 dark:bg-orange-800 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-orange-700 dark:text-orange-300" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} КБ
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        {selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl"
          >
            {uploading ? 'Загрузка...' : 'Загрузить файл'}
          </Button>
        )}
      </div>
    </Card>
  );
}