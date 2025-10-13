class EmotionModel:
    """
    Placeholder for future custom emotion models.
    Currently using DeepFace for facial emotion recognition.
    """
    
    def __init__(self):
        self.model_name = "DeepFace"
        self.version = "0.0.79"
    
    def predict(self, image):
        raise NotImplementedError("Using DeepFace directly in emotion_fusion.py")
