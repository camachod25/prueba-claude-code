class DomainException(Exception):
    pass


class SnippetNotFound(DomainException):
    def __init__(self, snippet_id: str):
        super().__init__(f"Snippet '{snippet_id}' not found")
        self.snippet_id = snippet_id


class FolderNotFound(DomainException):
    def __init__(self, folder_id: str):
        super().__init__(f"Folder '{folder_id}' not found")
        self.folder_id = folder_id


class UnauthorizedAccess(DomainException):
    def __init__(self, resource: str):
        super().__init__(f"Unauthorized access to '{resource}'")
