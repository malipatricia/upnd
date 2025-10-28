-- Update existing member statuses to use capitalized format
UPDATE members 
SET status = CASE 
  WHEN status = 'pending section review' THEN 'Pending Section Review'
  WHEN status = 'pending branch review' THEN 'Pending Branch Review'
  WHEN status = 'pending ward review' THEN 'Pending Ward Review'
  WHEN status = 'pending district review' THEN 'Pending District Review'
  WHEN status = 'pending provincial review' THEN 'Pending Provincial Review'
  ELSE status
END;