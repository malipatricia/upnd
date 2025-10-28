-- Update existing member statuses to use lowercase format
UPDATE members 
SET status = CASE 
  WHEN status = 'Pending Section Review' THEN 'pending section review'
  WHEN status = 'Pending Branch Review' THEN 'pending branch review'
  WHEN status = 'Pending Ward Review' THEN 'pending ward review'
  WHEN status = 'Pending District Review' THEN 'pending district review'
  WHEN status = 'Pending Provincial Review' THEN 'pending provincial review'
  ELSE status
END;