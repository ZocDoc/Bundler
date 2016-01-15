function stripComment(code) {

    return code.replace(/\n\/(\*|\/)# sourceMappingURL=(.*)$/g, '');

}

module.exports = stripComment;